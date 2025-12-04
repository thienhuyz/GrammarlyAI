import { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Tag } from "antd";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import { apiAdminGetUsers, apiAdminGetErrorStats } from "../../apis";

const COLORS = ["#4f46e5", "#22c55e"];

const AdminDashboard = () => {
    const [loading, setLoading] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [errorStats, setErrorStats] = useState({
        totalGrammar: 0,
        totalWordChoice: 0,
    });

    // TẠM: dữ liệu giả cho chart "xu hướng request"
    // Sau này bạn có API thống kê theo ngày thì replace phần này
    const [requestTrend] = useState([
        { day: "Mon", requests: 120, errors: 8 },
        { day: "Tue", requests: 150, errors: 12 },
        { day: "Wed", requests: 180, errors: 9 },
        { day: "Thu", requests: 200, errors: 11 },
        { day: "Fri", requests: 240, errors: 15 },
        { day: "Sat", requests: 160, errors: 7 },
        { day: "Sun", requests: 100, errors: 5 },
    ]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // 1. Tổng user từ API getUsers
            const usersRes = await apiAdminGetUsers({ page: 1, limit: 1 });
            if (usersRes?.success) {
                setTotalUsers(usersRes.counts || 0);
            }

            // 2. Thống kê lỗi tổng từ API stats/errors
            const errorRes = await apiAdminGetErrorStats();
            if (errorRes?.success) {
                setErrorStats(errorRes.data || {});
            }
        } catch (error) {
            console.error("Dashboard Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const totalErrors =
        (errorStats.totalGrammar || 0) + (errorStats.totalWordChoice || 0);

    const pieData = [
        {
            name: "Ngữ pháp",
            key: "totalGrammar",
            value: errorStats.totalGrammar || 0,
            color: COLORS[0],
        },
        {
            name: "Từ vựng",
            key: "totalWordChoice",
            value: errorStats.totalWordChoice || 0,
            color: COLORS[1],
        },
    ];

    const grammarPercent =
        totalErrors === 0
            ? 0
            : ((errorStats.totalGrammar || 0) / totalErrors) * 100;
    const wordChoicePercent = 100 - grammarPercent;

    return (
        <div className="space-y-5">
            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                        Admin Dashboard
                    </h2>
                    <p className="text-sm text-slate-500">
                        Tổng quan nhanh về hệ thống sửa lỗi ngữ pháp & từ vựng.
                    </p>
                </div>
                <Tag color="blue" className="text-xs md:text-sm px-3 py-1 rounded-full">
                    SaaS Monitoring · Real-time overview
                </Tag>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {/* KPI CARDS */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={6}>
                            <Card className="shadow-sm rounded-2xl">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Tổng số người dùng
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-slate-900">
                                    {totalUsers}
                                </p>
                                <p className="mt-1 text-xs text-emerald-500">
                                    +12% so với tuần trước (mock)
                                </p>
                            </Card>
                        </Col>

                        <Col xs={24} md={6}>
                            <Card className="shadow-sm rounded-2xl">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Tổng lỗi đã xử lý
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-slate-900">
                                    {totalErrors}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Gồm ngữ pháp & chọn từ
                                </p>
                            </Card>
                        </Col>

                        <Col xs={24} md={6}>
                            <Card className="shadow-sm rounded-2xl">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Lỗi ngữ pháp
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-slate-900">
                                    {errorStats.totalGrammar || 0}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {grammarPercent.toFixed(1)}% trên tổng lỗi
                                </p>
                            </Card>
                        </Col>

                        <Col xs={24} md={6}>
                            <Card className="shadow-sm rounded-2xl">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Lỗi chọn từ
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-slate-900">
                                    {errorStats.totalWordChoice || 0}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {wordChoicePercent.toFixed(1)}% trên tổng lỗi
                                </p>
                            </Card>
                        </Col>
                    </Row>

                    {/* MAIN CHARTS GRID */}
                    <Row gutter={[16, 16]}>
                        {/* PIE CHART + LEGEND */}
                        <Col xs={24} lg={10}>
                            <Card
                                title="Tỷ lệ các loại lỗi (%)"
                                className="shadow-sm rounded-2xl"
                            >
                                <div className="w-full h-80 flex flex-col lg:flex-row items-center justify-between gap-4">
                                    {totalErrors === 0 ? (
                                        <span className="text-slate-500 text-sm">
                                            Chưa có dữ liệu để hiển thị biểu đồ.
                                        </span>
                                    ) : (
                                        <>
                                            <div className="w-full lg:w-2/3 h-[260px]">
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                >
                                                    <PieChart>
                                                        <Pie
                                                            data={pieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={60}
                                                            outerRadius={90}
                                                            paddingAngle={4}
                                                            cornerRadius={8}
                                                            dataKey="value"
                                                            label={({
                                                                name,
                                                                percent,
                                                            }) =>
                                                                `${name}: ${(percent * 100).toFixed(
                                                                    1
                                                                )}%`
                                                            }
                                                        >
                                                            {pieData.map(
                                                                (entry, index) => (
                                                                    <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={
                                                                            entry.color
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </Pie>
                                                        <Tooltip
                                                            formatter={(
                                                                value,
                                                                name
                                                            ) =>
                                                                `${value} lỗi`
                                                            }
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>

                                            {/* LEGEND / SUMMARY */}
                                            <div className="w-full lg:w-1/3 space-y-3 text-sm">
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                                    Phân bố lỗi
                                                </p>
                                                {pieData.map((item) => {
                                                    const percent =
                                                        totalErrors === 0
                                                            ? 0
                                                            : (item.value /
                                                                totalErrors) *
                                                            100;
                                                    return (
                                                        <div
                                                            key={item.key}
                                                            className="flex items-center justify-between gap-2"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className="inline-block w-3 h-3 rounded-full"
                                                                    style={{
                                                                        backgroundColor:
                                                                            item.color,
                                                                    }}
                                                                />
                                                                <span className="text-slate-700">
                                                                    {item.name}
                                                                </span>
                                                            </div>
                                                            <span className="font-medium text-slate-900">
                                                                {percent.toFixed(
                                                                    1
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                                <div className="pt-2 border-t text-xs text-slate-500">
                                                    Tổng cộng{" "}
                                                    <span className="font-semibold text-slate-800">
                                                        {totalErrors} lỗi
                                                    </span>{" "}
                                                    đã được hệ thống xử lý.
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Card>
                        </Col>

                        {/* LINE CHART – TREND (DỮ LIỆU GIẢ) */}
                        <Col xs={24} lg={14}>
                            <Card
                                title="Xu hướng yêu cầu sửa lỗi theo ngày (demo)"
                                className="shadow-sm rounded-2xl"
                            >
                                <div className="w-full h-80">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart data={requestTrend}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="requests"
                                                name="Requests"
                                                stroke="#4f46e5"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="errors"
                                                name="Errors"
                                                stroke="#ef4444"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    * Dữ liệu xu hướng hiện tại đang được mock
                                    ở frontend để minh họa. Sau này bạn có thể
                                    nối API thống kê theo ngày/tháng để thay thế.
                                </p>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
