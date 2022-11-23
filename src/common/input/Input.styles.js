import styled, { css } from "styled-components";
import { calcRem } from "../../themes";
import loginId from "../../../src/assets/icons/loginId.png";
import password from "../../../src/assets/icons/password.png";

export const Input = styled.input`
	${({ variant }) => {
		switch (variant) {
			case "join":
				return css`
					/* &::after {
						content: "소희님 아프지 마세요오ㅠㅠ";
						display: block;
					} */
					${({ purpose }) => {
						return purpose === "sign-in"
							? `background-color: aliceblue;
						   border-radius: 10px;
							 background-image: url(${loginId});
							 background-repeat: no-repeat;
							 background-position: 15px center;
							 padding-left: 51px;
						`
							: `background-color: aliceblue;
						     border-radius: 10px;
							 background-image: url(${password});
							 background-repeat: no-repeat;
							 background-position: 15px center;
							 padding-left: 51px;
						`;
					}};
					width: ${calcRem(472)};
					height: 60px;
					border: 1px solid ${({ theme }) => theme.colors.line};
					border-radius: 5px;
					font-size: ${({ theme }) => theme.fontSizes.lg};
				`;
			/* 메인 페이지 */
			case "main-search":
				return css`
					width: 81%;
					max-width: ${calcRem(745)};
					height: 51px;
					border: 1px solid ${({ theme }) => theme.colors.line};
					border-top-right-radius: 20px;
					border-bottom-right-radius: 20px;
					padding: ${({ theme }) => theme.paddings.xl};
				`;
			default:
				break;
		}
	}}
`;
