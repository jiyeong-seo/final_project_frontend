import React from "react";
import {
	Box,
	Image,
	Text,
	Margin,
	Flex,
	Button,
	Strong,
} from "../../components";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Default, Mobile } from "../../assets/mediaQuery";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useEffect } from "react";
import MyCommentEdit from "./MyCommentEdit";
import spinner from "../../assets/icons/spinner.gif";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_SERVER;

//로컬스토리지 토큰가져오기
const authorization = localStorage.getItem("Authorization");

const fetchPostList = async pageParam => {
	const { data } = await axios.get(
		`${BASE_URL}/member/auth/mypage/comments?page=${pageParam}&size=3`,
		{
			headers: {
				authorization,
			},
		},
	);
	const { myPageList: page, isLast } = data;
	return { page, nextPage: pageParam + 1, isLast };
};

const MyComment = () => {
	//로컬스토리지 닉네임가져오기
	const nickname = localStorage.getItem("Nickname");
	const navigate = useNavigate();
	const { ref, inView } = useInView();
	const { data, status, fetchNextPage, isFetchingNextPage, error:infError } = useInfiniteQuery(
		["myComment"],
		({ pageParam = 1 }) => fetchPostList(pageParam),
		{
			getNextPageParam: lastPage =>
				!lastPage.isLast ? lastPage.nextPage : undefined,
		},
	);

	

	useEffect(() => {
		if (inView) fetchNextPage();
	}, [inView]);

	if (status === "loading")
		return (
			<Box variant="spinner-wrap">
				<Flex jc="center" ai="center">
					<Image src={spinner} alt="로딩중" variant="spinner" />
				</Flex>
			</Box>
		);
		if (infError.response.data === "작성한 댓글이 없습니다.") {
			return (
				<Box variant="spinner-wrap">
					<Flex fd="column" jc="center" ai="center" gap="100px">
						<Strong variant="warning">작성한 댓글이 없습니다😭</Strong>
						<Button onClick={() => navigate(-1)} variant="cafe-review-post">
							돌아가기
						</Button>
					</Flex>
				</Box>
			);
		}
	if (status === "error")
		return (
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
			<Default>
				<Margin margin="30px 3px 10px 3px">
					<Box variant="mypage-nav">
						<Text variant="title">작성 댓글 📋</Text>
					</Box>
				</Margin>
				{data.pages[0].page.length > 0 ? (
					<Box>
						{data?.pages?.map((page, idx) => (
							<React.Fragment key={idx}>
								{page?.page?.map(comment => (
									<>
										<MyCommentEdit key={comment.commentId} comment={comment} />
									</>
								))}
							</React.Fragment>
						))}
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
				) : (
					<>
						<Box variant="spinner-wrap">
							<Flex fd="column" jc="center" ai="center" gap="100px">
								<Strong variant="warning">작성한 댓글이 없습니다😭</Strong>
								<Button onClick={() => navigate(-1)} variant="cafe-review-post">
									돌아가기
								</Button>
							</Flex>
						</Box>
					</>
				)}
			</Default>
			<Mobile>
				{data.pages[0].page.length > 0 ? (
					<Box>
						{data?.pages?.map((page, idx) => (
							<React.Fragment key={idx}>
								{page?.page?.map(comment => (
									<>
										<MyCommentEdit key={comment.commentId} comment={comment} />
									</>
								))}
							</React.Fragment>
						))}
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
				) : (
					<>
						<Box variant="spinner-wrap">
							<Flex fd="column" jc="center" ai="center" gap="100px">
								<Strong variant="warning">작성한 댓글이 없습니다😭</Strong>
								<Button size="l" onClick={() => navigate(-1)} variant="cafe-review-post">
									돌아가기
								</Button>
							</Flex>
						</Box>
					</>
				)}
			</Mobile>
		</Box>
	);
};

export default MyComment;
