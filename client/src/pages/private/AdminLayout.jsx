import { useState } from "react";
import { Layout, Menu, theme } from "antd";
import { UserOutlined, DashboardOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        {
            key: "/admin",
            icon: <DashboardOutlined />,
            label: "Bảng điều khiển",
        },
        {
            key: "/admin/users",
            icon: <UserOutlined />,
            label: "Người dùng",
        },
    ];

    const selectedKey = location.pathname.startsWith("/admin/users")
        ? "/admin/users"
        : "/admin";

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* SIDEBAR */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                width={230}
                style={{
                    background: "#001529",
                    borderRight: "1px solid rgba(255,255,255,0.15)",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        height: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        gap: 10,
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                >
                    {!collapsed ? (
                        <span
                            style={{
                                color: "#fff",
                                fontSize: 20,
                                fontWeight: 700,
                                letterSpacing: 1,
                                textAlign: "center",
                                width: "100%",
                            }}
                        >
                            GRAMMARLYAI
                        </span>
                    ) : (
                        <span
                            style={{
                                color: "#fff",
                                fontSize: 22,
                                fontWeight: 700,
                            }}
                        >
                            GA
                        </span>
                    )}
                </div>

                {/* Menu */}
                <Menu
                    theme="dark"
                    mode="inline"
                    items={items}
                    selectedKeys={[selectedKey]}
                    onClick={({ key }) => navigate(key)}
                    style={{
                        paddingLeft: 10,
                        fontSize: 15,
                        paddingTop: 10,
                    }}
                />
            </Sider>

            {/* MAIN CONTENT */}
            <Layout style={{ background: "#f3f4f6" }}>
                <Content
                    style={{
                        margin: "0 auto",
                        padding: "16px 32px",
                        height: "100vh",
                        overflow: "hidden",
                        background: colorBgContainer,
                        maxWidth: 1400,
                        width: "100%",
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
