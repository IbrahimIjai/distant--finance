import { useEffect, useState, useCallback, useRef } from "react";

interface TimeRemaining {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	formatted: string;
	isExpired: boolean;
	isValid: boolean;
}

const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;
const UPDATE_INTERVAL_MS = 1000;
const MIN_VALID_TIMESTAMP = 1000;

function calculateTimeRemaining(timestamp: number): TimeRemaining {
	try {
		if (!timestamp || typeof timestamp !== "number" || isNaN(timestamp)) {
			return {
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0,
				formatted: "Invalid timestamp",
				isExpired: true,
				isValid: false,
			};
		}

		if (timestamp > 0 && timestamp < MIN_VALID_TIMESTAMP) {
			return {
				days: timestamp,
				hours: 0,
				minutes: 0,
				seconds: 0,
				formatted: `${timestamp} Days`,
				isExpired: false,
				isValid: true,
			};
		}

		const nowInSeconds = Date.now() / 1000;
		const timeDiffInSeconds = timestamp - nowInSeconds;

		if (timeDiffInSeconds <= 0) {
			return {
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0,
				formatted: "Loan Expired",
				isExpired: true,
				isValid: true,
			};
		}

		const days = Math.floor(timeDiffInSeconds / SECONDS_IN_DAY);
		const hours = Math.floor(
			(timeDiffInSeconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR,
		);
		const minutes = Math.floor(
			(timeDiffInSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE,
		);
		const seconds = Math.floor(timeDiffInSeconds % SECONDS_IN_MINUTE);

		const formatted = `${days}d, ${hours}h, ${minutes}m, ${seconds}s left`;

		return {
			days,
			hours,
			minutes,
			seconds,
			formatted,
			isExpired: false,
			isValid: true,
		};
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("[useTimeStamp] Error calculating time remaining:", error);
		}

		return {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			formatted: "Error calculating time",
			isExpired: true,
			isValid: false,
		};
	}
}

export default function useTimeStamp(timestamp: number): string {
	const [timeRemaining, setTimeRemaining] = useState<string>(() => {
		const initial = calculateTimeRemaining(timestamp);
		return initial.formatted;
	});

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const mountedRef = useRef<boolean>(true);

	const updateTimeRemaining = useCallback(() => {
		if (!mountedRef.current) return;

		const result = calculateTimeRemaining(timestamp);
		setTimeRemaining(result.formatted);

		if (result.isExpired || !result.isValid) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}
	}, [timestamp]);

	useEffect(() => {
		mountedRef.current = true;

		updateTimeRemaining();

		intervalRef.current = setInterval(updateTimeRemaining, UPDATE_INTERVAL_MS);

		return () => {
			mountedRef.current = false;
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [updateTimeRemaining]);

	return timeRemaining;
}

export function useTimeStampDetailed(timestamp: number): TimeRemaining {
	const [timeData, setTimeData] = useState<TimeRemaining>(() =>
		calculateTimeRemaining(timestamp),
	);

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const mountedRef = useRef<boolean>(true);

	const updateTimeData = useCallback(() => {
		if (!mountedRef.current) return;

		const result = calculateTimeRemaining(timestamp);
		setTimeData(result);

		if (result.isExpired || !result.isValid) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}
	}, [timestamp]);

	useEffect(() => {
		mountedRef.current = true;

		updateTimeData();

		intervalRef.current = setInterval(updateTimeData, UPDATE_INTERVAL_MS);

		return () => {
			mountedRef.current = false;
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [updateTimeData]);

	return timeData;
}
