import React from "react";
import { Box, Button, Flex, Strong } from "../../../components";
import  MblBoardItem from "./MlbBoardItem";

const MblBoard = ({ data, navigate, onDeletePost, onEditPost }) => {
	return ( 
    <Box>      
        {data?.pages[0].page.length ? (
            <Flex fd="column-reverse">
            {data?.pages?.map((page, idx) => (
                <React.Fragment key={idx}>
                    {page?.page?.map(item => (
                        <>
                            <MblBoardItem
                                key={item.boardId}
                                item={item}
                                navigate={navigate}
                                onDeletePost={onDeletePost}
                                onEditPost={onEditPost}
                            />
                        </>
                    ))}
                </React.Fragment>
            ))}
        </Flex>
        ) : (
            <Box variant="spinner-wrap">
            <Flex fd="column" jc="center" ai="center" gap="100px">
                <Strong variant="warning">
                   작성한 게시물이 없습니다😭 
                </Strong>
                <Button size="l" onClick={() => navigate(-1)} variant="cafe-review-post">
                    돌아가기
                </Button>
            </Flex>
        </Box>
        )}
    </Box>);
};

export default MblBoard;
