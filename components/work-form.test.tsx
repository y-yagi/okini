import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import Work from "../types/work";
import WorkForm from "./work-form";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

test("matching text", () => {
  const work = {} as Work;
  const handleSubmit = function () {};
  const { container } = render(<WorkForm work={work} action={handleSubmit} />);
  expect(container.innerHTML).toMatch("Works");
});

test("onSubmit", () => {
  const mockRouter = { push: jest.fn() };
  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  const work = {
    name: "",
    artistName: "",
    content: "",
    collection: "",
  } as Work;
  const mockFn = jest.fn();
  const { getByPlaceholderText, getByText } = render(
    <WorkForm work={work} action={mockFn} />
  );
  fireEvent.change(getByPlaceholderText("name"), { target: { value: "name" } });
  fireEvent.change(getByPlaceholderText("artist name"), {
    target: { value: "artist name" },
  });
  fireEvent.change(getByPlaceholderText("Content"), {
    target: { value: "content" },
  });
  fireEvent.click(getByText("Submit"));
  (async () => {
    await waitFor(() => expect(mockFn).toHaveBeenCalledTimes(1));
  })();
});