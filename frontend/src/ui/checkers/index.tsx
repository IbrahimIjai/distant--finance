import { ButtonProps } from "@/components/ui/button";
import { ComponentType } from "react";
import { ApprovalERC721Props } from "./erc721-approval";
import { Connect } from "./connect";
import {ApprovalERC721} from "./erc721-approval";
export type CheckerProps = {
	ApprovalERC721: ComponentType<ApprovalERC721Props>;
	Connect: ComponentType<ButtonProps>;
};

export const Checker: CheckerProps = {
	ApprovalERC721,
	Connect,
};
