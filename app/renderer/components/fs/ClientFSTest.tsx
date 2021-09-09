import dynamic from "next/dynamic";

export default dynamic(() => import("./FSTest"), { ssr: false });
