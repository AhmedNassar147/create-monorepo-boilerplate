/*
 *
 * Package:  `@domain/pkg1`.
 *
 */

console.log("BUILD_YEAR @domain/pkg1", BUILD_YEAR);
const ReactComponent = ({ name }: { name: string }): JSX.Element => (
  <div>
    <p>{name}</p>
    <p>hello from package @domain/pkg1</p>
    <p>{name}</p>
    <p>{name}</p>
  </div>
);

export default ReactComponent;
