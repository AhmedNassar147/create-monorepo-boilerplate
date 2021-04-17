/*
 *
 * Package: `@domain/base-page`.
 *
 */
import { FC } from "react";
import { ParentProps } from "@domain/types";
import { AppHeader, MainLayout, Text } from "./styled";

const BasePage: FC<ParentProps> = ({ children }) => (
  <>
    <AppHeader>
      <Text>app header</Text>
    </AppHeader>
    <MainLayout>{children}</MainLayout>
  </>
);

export default BasePage;
