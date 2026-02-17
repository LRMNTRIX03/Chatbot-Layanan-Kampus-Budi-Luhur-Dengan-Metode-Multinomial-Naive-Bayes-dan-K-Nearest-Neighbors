import { HelpCircle, Boxes, MessageCircle, Ban, Reply } from "lucide-react";

import usePattern from "../../hooks/usePattern";
import useIntent from "../../hooks/useIntent";
import useSlagwords from "../../hooks/useSlagwords";
import useStopword from "../../hooks/useStopword";
import useResponse from "../../hooks/useResponse"; 
import { NavLink } from "react-router-dom";

export default function Dashboard() {
    const { patterns } = usePattern();
    const { intents } = useIntent();
    const { slangwords } = useSlagwords();
    const { Stopword } = useStopword();
    const { responses } = useResponse();

    const colors = {
        blue: "bg-blue-500 hover:bg-blue-300",
        green: "bg-green-500 hover:bg-green-700",
        yellow: "bg-yellow-500 hover:bg-yellow-700",
        purple: "bg-purple-500 hover:bg-purple-700",
        red: "bg-red-500 hover:bg-red-700",
    };

    const cards = [
        { title: "Total Patterns", value: patterns.length, color: "blue", icon: HelpCircle, link: "/admin/pattern" },
        { title: "Total Tag", value: intents.length, color: "green", icon: Boxes, link:"/admin/intent" },
        { title: "Total Slangwords", value: slangwords.length, color: "yellow", icon: MessageCircle, link: "/admin/slangwords" },
        { title: "Total Stopwords", value: Stopword.length, color: "purple", icon: Ban, link:"/admin/stopwords" },
        { title: "Total Responses", value: responses.length, color: "red", icon: Reply, link:"/admin/response" },
    ];

    return (
        <div className="w-full flex justify-center mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-[90%]">
                {cards.map((card, index) => {
                    
                    const Icon = card.icon;

                    return (
                        <NavLink key={index} to={card.link}>
                            <div
                                className={`${colors[card.color]} transition-all duration-300 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-3`}
                            >
                                <Icon size={40} strokeWidth={1.5} className="opacity-90" />

                                <h1 className="text-xl font-semibold">
                                    {card.title}
                                </h1>

                                <p className="text-3xl font-bold">
                                    {card.value}
                                </p>
                            </div>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
}
