import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Box, Flex, Button, Strong  } from "../../components";
// 로딩 스피너
import spinner from "../../assets/icons/spinner.gif";
import { Like } from "./like";

const BASE_URL = process.env.REACT_APP_SERVER;

//로컬스토리지 토큰가져오기
const authorization = localStorage.getItem("Authorization");

const fetchPostList = async pageParam => {
	const { data } = await axios.get(
		`${BASE_URL}/member/auth/mypage/heart-boards?page=${pageParam}&size=3`,
		{
			headers: {
				authorization,
			},
		},		
	);
	const { myPageList:page, isLast } = data;	
	return { page, nextPage: pageParam + 1, isLast };
};

const MyLike = () => {
	const { ref, inView } = useInView();
	const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
		["myLike"],
		({ pageParam = 1 }) => fetchPostList(pageParam),
		{
			getNextPageParam: lastPage =>
				!lastPage.isLast ? lastPage.nextPage : undefined,
		},
	);

	console.log("data.pages===>", data?.pages);

	useEffect(() => {
		if (inView) fetchNextPage();
	}, [inView]);

	const navigate = useNavigate();

	if (status === "loading")
		return (
		<Box variant="spinner-wrap">
			<Flex jc="center" ai="center">
				<Image src={spinner} alt="로딩중" variant="spinner" />
			</Flex>
		</Box>
		);
	if (status === "error") return (
		<Box variant="spinner-wrap">
					<Flex fd="column" jc="center" ai="center" gap="100px">
						<Strong variant="warning">
							에러입니다.😭 빠른 시일 내에 해결하겠습니다.
						</Strong>
						<Button onClick={() => navigate(-1)} variant="cafe-review-post">
							돌아가기
						</Button>
					</Flex>
				</Box>
	);

	return (
		<Box>
			<Like
				data={data}
				navigate={navigate}
			/>
				{isFetchingNextPage ? (
				<Box variant="spinner-wrap">
				<Flex jc="center" ai="center">
					<Image src={spinner} alt="로딩중" variant="spinner" />
				</Flex>
			</Box>
			) : (
				<div ref={ref}></div>
			)}
		</Box>
	);
};

export default MyLike;
