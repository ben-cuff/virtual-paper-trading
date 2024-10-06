"use client";

import { useEffect, useState } from "react";
import getPortfolio from "@/util/get-portfolio";

export default function Portfolio({ id }: { id: number }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const result = await getPortfolio(id);
            setData(result);
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        if (data) {
            console.log(JSON.stringify(data, null, 2));
        }
    }, [data]);

    return <></>;
}
