/**
 * blockedUsersStore — the blocked author ids (Apple 1.2).
 * load → GET /users/blocked; unblock → DELETE /users/block/:id with a
 * rollback on failure; isBlockedAuthor matches only a known id.
 */
import { nodeApi } from "@/api/nodeApi";
import { useBlockedUsersStore, isBlockedAuthor } from "@/stores/blockedUsersStore";

beforeEach(() => {
  jest.clearAllMocks();
  useBlockedUsersStore.setState({ ids: [] });
});

describe("blockedUsersStore", () => {
  it("loads the list from the server", async () => {
    (nodeApi.get as jest.Mock).mockResolvedValueOnce({ data: { blockedUsers: ["a", "b"] } });
    await useBlockedUsersStore.getState().load();
    expect(nodeApi.get).toHaveBeenCalledWith("/users/blocked");
    expect(useBlockedUsersStore.getState().ids).toEqual(["a", "b"]);
  });

  it("keeps the current list when the load fails", async () => {
    useBlockedUsersStore.setState({ ids: ["a"] });
    (nodeApi.get as jest.Mock).mockRejectedValueOnce(new Error("offline"));
    await useBlockedUsersStore.getState().load();
    expect(useBlockedUsersStore.getState().ids).toEqual(["a"]);
  });

  it("unblocks a user", async () => {
    useBlockedUsersStore.setState({ ids: ["a", "b"] });
    (nodeApi.delete as jest.Mock).mockResolvedValueOnce({ data: { blockedUsers: ["b"] } });
    await useBlockedUsersStore.getState().unblock("a");
    expect(nodeApi.delete).toHaveBeenCalledWith("/users/block/a");
    expect(useBlockedUsersStore.getState().ids).toEqual(["b"]);
  });

  it("adds the id again when the unblock fails", async () => {
    useBlockedUsersStore.setState({ ids: ["a"] });
    (nodeApi.delete as jest.Mock).mockRejectedValueOnce(new Error("500"));
    await expect(useBlockedUsersStore.getState().unblock("a")).rejects.toThrow("500");
    expect(useBlockedUsersStore.getState().ids).toEqual(["a"]);
  });

  it("keeps an id that was already blocked when a new block fails", async () => {
    useBlockedUsersStore.setState({ ids: ["a"] });
    (nodeApi.post as jest.Mock).mockRejectedValueOnce(new Error("500"));
    await expect(useBlockedUsersStore.getState().block("a")).rejects.toThrow("500");
    expect(useBlockedUsersStore.getState().ids).toEqual(["a"]);
  });

  it("isBlockedAuthor matches only a known author id", () => {
    expect(isBlockedAuthor(["a"], "a")).toBe(true);
    expect(isBlockedAuthor(["a"], "b")).toBe(false);
    expect(isBlockedAuthor(["a"], undefined)).toBe(false);
  });
});
