import React, { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { Quote } from "../models";
import Error from "../pages/Error";
import Loading from "./Loading";
import { useAxios } from "../hooks/useAxios";

const QuoteListMain: FC = () => {
  const { isLoading, isError, getQuotesData, dataQuotes, listAges } =
    useAxios();

  useEffect(() => {
    getQuotesData();
  }, []);

  let count: number = -1;

  if (isLoading) return <Loading />;
  if (isError.error) return <Error />;
  return (
    <main className="main">
      <div className="main-table-title">
        <div className="grid-col-1 grid-flex">ID</div>
        <div className="grid-col-2 grid-flex">Quote</div>
        <div className="grid-col-3 grid-flex">Author</div>
        <div className="grid-col-4 grid-flex">Age</div>
      </div>
      {dataQuotes?.results.map((quote: Quote) => {
        const { _id, content, author } = quote;
        count = count + 1;
        return (
          <div key={_id} className="main-row">
            <div className="grid-col-1 grid-flex">{_id}</div>
            <div className="grid-col-2 grid-flex">{content}</div>
            <div className="grid-col-3 grid-flex">{author}</div>
            <div className="grid-col-4 grid-flex">
              {listAges === undefined ? 0 : listAges[count].age}
              {listAges === undefined
                ? 0
                : listAges[count].age >= 50
                ? "🧓"
                : "👶"}
            </div>
          </div>
        );
      })}
      <div className="btn-container">
        <Link to={"/randomQuote"} className="btn-darkblue mt mb">
          Get new quote!
        </Link>
      </div>
    </main>
  );
};

export default QuoteListMain;
