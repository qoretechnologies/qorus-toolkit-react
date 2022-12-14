import { fireEvent, render } from "@testing-library/react";
import { noop } from "lodash";
import React from "react";
import {
  ReqoreContent,
  ReqoreInput,
  ReqoreLayoutContent,
  ReqoreUIProvider,
} from "../src";

test("Renders <Input /> properly", () => {
  render(
    <ReqoreUIProvider>
      <ReqoreLayoutContent>
        <ReqoreContent>
          <ReqoreInput minimal />
          <ReqoreInput disabled />
          <ReqoreInput size="big" />
        </ReqoreContent>
      </ReqoreLayoutContent>
    </ReqoreUIProvider>
  );

  expect(document.querySelectorAll(".reqore-input").length).toBe(3);
  // No clear button
  expect(document.querySelectorAll(".reqore-clear-input-button").length).toBe(
    0
  );
});

test("Renders <Input /> with clear button properly", () => {
  const fn = jest.fn();

  render(
    <ReqoreUIProvider>
      <ReqoreLayoutContent>
        <ReqoreContent>
          <ReqoreInput minimal onChange={noop} onClearClick={fn} />
        </ReqoreContent>
      </ReqoreLayoutContent>
    </ReqoreUIProvider>
  );

  // No clear button
  expect(document.querySelectorAll(".reqore-clear-input-button").length).toBe(
    1
  );

  fireEvent.click(document.querySelector(".reqore-clear-input-button"));

  expect(fn).toHaveBeenCalled();
});

test("Disabled <Input /> cannot be cleared", () => {
  const fn = jest.fn();

  render(
    <ReqoreUIProvider>
      <ReqoreLayoutContent>
        <ReqoreContent>
          <ReqoreInput minimal onChange={noop} onClearClick={fn} disabled />
        </ReqoreContent>
      </ReqoreLayoutContent>
    </ReqoreUIProvider>
  );

  // No clear button
  expect(document.querySelectorAll(".reqore-clear-input-button").length).toBe(
    0
  );
});
