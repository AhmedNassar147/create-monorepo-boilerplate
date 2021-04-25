/*
 *
 * Package: `@domain/lorem-ipsum-page`.
 *
 */
import { memo, useState, useCallback, ChangeEvent } from "react";

const LoremIpsumPage = () => {
  const [counter, setState] = useState(0);

  const onChange = useCallback((event: ChangeEvent) => {
    // @ts-ignore just test case.
    setState(event.target.value);
  }, []);

  const onButtonClicked = useCallback(
    (actionType: string) => () => {
      setState((previousCounter) =>
        actionType === "increase" ? ++previousCounter : --previousCounter,
      );
    },
    [],
  );

  return (
    <>
      <div
        css={`
        display: flex;
        width: 300px;
        margin 50px auto;
        justify-content: space-between;
      `}
      >
        <button onClick={onButtonClicked("decrease")}>-</button>
        <input value={counter} onChange={onChange} />
        <button onClick={onButtonClicked("increase")}>+</button>
      </div>

      <img src="assets/image1.jpg" alt="some-alt" />
    </>
  );
};

export default memo(LoremIpsumPage);
