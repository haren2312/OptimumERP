import { Button, Flex } from "@chakra-ui/react";
import { createSearchParams, useNavigate } from "react-router-dom";
import useQuery from "../../../hooks/useQuery";

export default function Pagination({ total, currentPage }) {
  const navigate = useNavigate();
  const query = useQuery();
  const onClick = (pageNumber) => {
    navigate({
      pathname: ``,
      search: createSearchParams({
        query: query.get("query") || "",
        page: pageNumber,
      }).toString(),
    });
  };
  const start = Math.max(0, currentPage - 10);
  const end = Math.min(start + 9, total - 1);
  const paginate = [];
  for (let i = start; i <= end; i++) paginate.push(i);
  return (
    <Flex
      alignItems={"center"}
      gap={5}
      marginBlock={3}
      flexWrap={"wrap"}
      justifyContent={"center"}
    >
      <Button
        size={"sm"}
        onClick={() => onClick(--currentPage)}
        isDisabled={currentPage === 1}
      >
        Previous
      </Button>
      { currentPage >= total ? null :  paginate.map((page) => {
        return (
          <Button
            size={"sm"}
            isActive={currentPage === page + 1}
            key={page}
            onClick={() => onClick(page + 1)}
            colorScheme={"green"}
          >
            {page + 1}
          </Button>
        );
      })}
      <Button
        size={"sm"}
        onClick={() => onClick(++currentPage)}
        isDisabled={currentPage >= total}
      >
        Next
      </Button>
    </Flex>
  );
}
