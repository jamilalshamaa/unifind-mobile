/**
 * ReviewSection removes the reviews of a blocked author at once (Apple 1.2).
 */
import { render, screen, act } from "@testing-library/react-native";
import { ReviewSection, type ReviewSectionData } from "@/components/shared/ReviewSection";
import { useBlockedUsersStore } from "@/stores/blockedUsersStore";

const review = (id: string, reviewerId: string, name: string) => ({
  id,
  reviewerId,
  generalRating: 4,
  date: "2025-01-15T00:00:00Z",
  comment: "",
  experience: `Text ${name}`,
  studyPeriod: "",
  ratings: [],
  author: { name },
});

const data: ReviewSectionData = {
  average: 4,
  totalReviews: 2,
  distribution: [],
  categories: [],
  reviews: [review("r1", "auth0|a", "Alice"), review("r2", "auth0|b", "Bob")],
};

beforeEach(() => useBlockedUsersStore.setState({ ids: [] }));

it("hides the reviews of a blocked author", () => {
  render(<ReviewSection data={data} currentPage={1} totalPages={1} onPageChange={() => {}} />);
  expect(screen.getByText("Alice")).toBeTruthy();
  expect(screen.getByText("Bob")).toBeTruthy();

  act(() => useBlockedUsersStore.setState({ ids: ["auth0|a"] }));

  expect(screen.queryByText("Alice")).toBeNull();
  expect(screen.getByText("Bob")).toBeTruthy();
});
