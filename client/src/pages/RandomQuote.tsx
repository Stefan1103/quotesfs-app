import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAxios } from "../hooks/useAxios";
import Error from "./Error";
import Loading from "../components/Loading";

const RandomQuote: FC = () => {
  const { isLoading, isError, dataRandomQuote, getRandomQuote } = useAxios();

  const [sendRequest, setSendRequest] = useState<boolean>(false);
  const nav = useNavigate();

  useEffect(() => {
    getRandomQuote();
  }, []);

  useEffect(() => {
    if (sendRequest) {
      setSendRequest(false);
      getRandomQuote();
    }
  }, [sendRequest, getRandomQuote]);

  if (isLoading) return <Loading />;
  if (isError.error) return <Error />;

  return (
    <div className="random-quote-main">
      <div className="random-quote-content">
        <h3 className="mb bt">{dataRandomQuote?.results[0].author}</h3>
        <p className="mr ml">{dataRandomQuote?.results[0].content}</p>
      </div>
      <div className="btn-container-rq mt">
        <button
          onClick={() => setSendRequest(true)}
          className="btn-darkblue mt mb"
        >
          {" "}
          Get new quote !!
        </button>
        <button onClick={() => nav(-1)} className="btn-darkblue mt mb">
          Back
        </button>
      </div>
    </div>
  );
};

export default RandomQuote;
