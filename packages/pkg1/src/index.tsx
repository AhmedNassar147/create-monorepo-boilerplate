/*
 *
 * Package:  `@domain/pkg1`.
 *
 */

console.log("BUILD_YEAR", BUILD_YEAR);
const ReactComponent = ({ name }: { name: string }): JSX.Element => (
  <div>
    <div>@domain/pkg1</div>
    {name}
    <div>@domain/pkg1</div>
    {name}
    {name}
    <p>ahmed nassar</p>
  </div>
);

export default ReactComponent;
