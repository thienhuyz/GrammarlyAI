import { useEffect, useState } from "react";
import { Table, Input, Button, Tag, Space, Modal, Form, Select, Popconfirm, } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, } from "@ant-design/icons";
import { toast } from "react-toastify";
import { apiAdminDeleteUser, apiAdminGetUsers, apiAdminUpdateUser, } from "../../apis";

const { Search } = Input;
const { Option } = Select;

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    //  FETCH USERS 
    const fetchUsers = async (
        page = 1,
        pageSize = 10,
        name = "",
        sortValue = null
    ) => {
        try {
            setLoading(true);

            const params = { page, limit: pageSize };
            if (name.trim()) params.name = name.trim();
            if (sortValue) params.sort = sortValue;

            const res = await apiAdminGetUsers(params);

            if (res?.success) {
                setUsers(res.users || []);
                setPagination((prev) => ({
                    ...prev,
                    current: page,
                    pageSize,
                    total: res.counts || 0,
                }));
            } else {
                toast.error(res?.mes || "Không lấy được danh sách người dùng");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1, pagination.pageSize, searchText, sort);
    }, []);

    //  TABLE CHANGE (phân trang + sort) 
    const handleTableChange = (paginationInfo, _filters, sorter) => {
        const { current, pageSize } = paginationInfo;

        let sortValue = null;
        if (sorter && sorter.order && sorter.field) {
            sortValue =
                sorter.order === "ascend"
                    ? sorter.field
                    : `-${sorter.field}`;
        }

        setSort(sortValue);
        fetchUsers(current, pageSize, searchText, sortValue);
    };

    //  SEARCH 
    const handleSearch = (value) => {
        const name = value.trim();
        setSearchText(name);
        fetchUsers(1, pagination.pageSize, name, sort);
    };

    const handleRefresh = () => {
        setSearchText("");
        fetchUsers(1, pagination.pageSize, "", sort);
    };

    //  EDIT USER 
    const openEditModal = (user) => {
        setEditingUser(user);
        form.setFieldsValue({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            mobile: user.mobile,
            role: user.role || "user",
        });
        setIsModalOpen(true);
    };

    const handleUpdateUser = async () => {
        try {
            const values = await form.validateFields();
            if (!editingUser?._id) return;

            const res = await apiAdminUpdateUser(editingUser._id, values);

            if (res?.success) {
                toast.success("Cập nhật user thành công!");
                setIsModalOpen(false);
                setEditingUser(null);
                form.resetFields();
                fetchUsers(
                    pagination.current,
                    pagination.pageSize,
                    searchText,
                    sort
                );
            } else {
                toast.error(res?.mes || "Cập nhật user thất bại!");
            }
        } catch (error) {
            if (error?.errorFields) return;
            console.error(error);
            toast.error("Có lỗi xảy ra khi cập nhật user");
        }
    };

    //  DELETE USER 
    const handleDeleteUser = async (user) => {
        try {
            const res = await apiAdminDeleteUser(user._id);
            if (res?.success) {
                toast.success("Xóa user thành công!");
                const newTotal = pagination.total - 1;
                const maxPage = Math.max(
                    1,
                    Math.ceil(newTotal / pagination.pageSize)
                );
                const newPage = Math.min(pagination.current, maxPage);
                fetchUsers(newPage, pagination.pageSize, searchText, sort);
            } else {
                toast.error(res?.mes || "Xóa user thất bại!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi xóa user");
        }
    };

    //  COLUMNS 
    const columns = [
        {
            title: "STT",
            key: "index",
            width: 60,
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + (index + 1),
        },
        {
            title: "Họ tên",
            dataIndex: "firstname",
            key: "firstname",
            width: 250,
            sorter: true,
            render: (_, record) =>
                `${record.firstname || ""} ${record.lastname || ""}`.trim(),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: true,
        },
        {
            title: "Số điện thoại",
            dataIndex: "mobile",
            key: "mobile",
            width: 150,
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            width: 110,
            render: (role) => (
                <Tag color={role === "admin" ? "red" : "blue"}>
                    {(role || "user").toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            width: 180,
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        style={{
                            borderRadius: 6,
                            background: "#e6f4ff",
                            borderColor: "#91caff",
                            color: "#1677ff",
                            fontWeight: 500,
                        }}
                        onClick={() => openEditModal(record)}
                    >
                        Sửa
                    </Button>

                    <Popconfirm
                        title="Xóa người dùng?"
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDeleteUser(record)}
                    >
                        <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                            style={{
                                borderRadius: 6,
                                background: "#fff1f0",
                                borderColor: "#ffa39e",
                                color: "#ff4d4f",
                                fontWeight: 500,
                            }}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                        Quản lý người dùng
                    </h2>
                    <p className="text-sm text-slate-500">
                        Xem, chỉnh sửa và quản lý tài khoản người dùng hệ thống.
                    </p>
                </div>

                <Space>
                    <Search
                        allowClear
                        placeholder="Tìm theo tên / email"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onSearch={handleSearch}
                        style={{ width: 260 }}
                        enterButton={<SearchOutlined />}
                    />
                    <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                        Làm mới
                    </Button>
                </Space>
            </div>

            {/* TABLE */}
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={users}
                loading={loading}
                size="middle"
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: false,
                    showTotal: (total) => `Tổng ${total} người dùng`,
                }}
                onChange={handleTableChange}
                bordered
                className="table-center"
            />

            {/* MODAL */}
            <Modal
                title="Cập nhật người dùng"
                open={isModalOpen}
                onOk={handleUpdateUser}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                    form.resetFields();
                }}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Họ"
                        name="firstname"
                        rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tên"
                        name="lastname"
                        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Số điện thoại" name="mobile">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Vai trò"
                        name="role"
                        rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                    >
                        <Select>
                            <Option value="user">User</Option>
                            <Option value="admin">Admin</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminUsers;
