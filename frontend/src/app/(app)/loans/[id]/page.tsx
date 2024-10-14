import LoanIdComponent from "@/ui/loans/loan-id";
import React from "react";

export default function LoanIdPage({ params }: { params: { id: string } }) {
	return (
		<div className="mt-24 max-w-7xl mx-auto">
			<LoanIdComponent id={params.id} />
		</div>
	);
}
