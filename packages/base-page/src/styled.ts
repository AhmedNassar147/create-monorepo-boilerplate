/*
 *
 * Styled: `@domain/base-page`.
 *
 */
import styled from "styled-components";

export const AppHeader = styled.header`
  height: 62px;
  background-color: green;
  width: 100%;
`;

export const MainLayout = styled.main`
  width: 100%;
  max-width: 100%;
  min-height: calc(100vh - 62px);
  max-height: calc(100vh - 62px);
  background-color: blue;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const Text = styled.p`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
`;
