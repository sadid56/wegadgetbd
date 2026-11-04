import { Badge, type BadgeProps } from "@/components/ui/badge";

export interface ReviewStatusChipProps extends Omit<BadgeProps, "children" | "variant"> {
  status: "APPROVED" | "PENDING" | "REJECTED" | string;
}

export function ReviewStatusChip({ status, ...props }: ReviewStatusChipProps) {
  const normalized = status?.toUpperCase();

  if (normalized === "APPROVED") {
    return (
      <Badge variant='success' {...props}>
        {status}
      </Badge>
    );
  }

  if (normalized === "PENDING") {
    return (
      <Badge variant='secondary' {...props}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant='danger' {...props}>
      {status}
    </Badge>
  );
}
