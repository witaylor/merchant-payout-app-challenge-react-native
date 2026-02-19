import { render, screen } from "@testing-library/react-native";

import { RecentActivityListSection } from "./recent-activity-list-section";

const mockActivities = [
  {
    id: "act_001",
    type: "deposit" as const,
    amount: 150000,
    currency: "GBP" as const,
    date: "2025-01-15T10:00:00Z",
    description: "Payment from Customer ABC",
    status: "completed" as const,
  },
];

describe("RecentActivityListSection", () => {
  it("renders section title and list", () => {
    render(<RecentActivityListSection activities={mockActivities} />);

    expect(screen.getByText("Recent Activity")).toBeTruthy();
    expect(screen.getByText("Payment from Customer ABC")).toBeTruthy();
  });
});
