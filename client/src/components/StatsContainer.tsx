import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from "react-icons/fa";
import Wrapper from "../assets/wrappers/StatsContainer";
import StatItem from "./StatItem";

const StatsContainer = ({ defaultStats }) => {
    const stats = [
        {
            title: "pending applications",
            count: defaultStats?.pending || 0,
            icon: <FaSuitcaseRolling />,
            color: "#f59e0b",
            bcg: "#fef3c7",
        },
        {
            title: "interviews scheduled",
            count: defaultStats?.interview || 0,
            icon: <FaCalendarCheck />,
            color: "#3b82f6",
            bcg: "#dbeafe",
        },
        {
            title: "rejected applications",
            count: defaultStats?.declined || 0,
            icon: <FaBug />,
            color: "#ef4444",
            bcg: "#fee2e2",
        },
    ];

    return (
        <Wrapper>
            {stats.map((item) => {
                return <StatItem key={item.title} {...item} />;
            })}
        </Wrapper>
    );
};

export default StatsContainer;
