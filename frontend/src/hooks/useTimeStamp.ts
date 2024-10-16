import { useEffect, useState } from "react";

export default function useTimeStamp(timestamp: number) {
  const [timeRemaining, setTimeRemaining] = useState("");
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now() / 1000;
      const timeDiff = timestamp - now;

      if (timestamp > 0 && timestamp < 1000) {
        setTimeRemaining(`${timestamp} Days`);
        clearInterval(intervalId);
      } else if (timeDiff <= 0) {
        setTimeRemaining("Loan Expired");
        clearInterval(intervalId);
      } else {
        const days = Math.floor(timeDiff / 86400);
        const hours = Math.floor((timeDiff % 86400) / 3600);
        const minutes = Math.floor((timeDiff % 3600) / 60);
        const seconds = Math.floor(timeDiff % 60);
        const timeString = `${days}d, ${hours}h, ${minutes}m, ${seconds}s left`;
        setTimeRemaining(timeString);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timestamp]);

  return timeRemaining;
}
