/*
 *
 * Package:  `@domain/pkg1`.
 *
 */
const ReactComponent = ({ name }: { name: string }): JSX.Element => (
  <div>
    <div>@domain/pkg1</div>
    {name}
    <div>@domain/pkg1</div>
    {name}
    {name}
  </div>
);

export default ReactComponent;
