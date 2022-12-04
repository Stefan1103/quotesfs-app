import axios from "axios";
import { useState } from "react";
import { QuotesList, err, RandomQuote, Age } from "../models";

export const useAxios = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<err>({
    error: false,
    status: null,
    statusText: "",
  });

  const urlRandom = "http://localhost:5000/random";
  const url = "http://localhost:5000/quotes";
  const [dataQuotes, setDataQuotes] = useState<QuotesList>();
  const [dataRandomQuote, setDataRandomQuote] = useState<RandomQuote>();

  const [listAges, setListAges] = useState<Age[]>([]);
  const newArrAges: Age[] = [];

  const getRandomQuote = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.get(urlRandom);
      const result: RandomQuote = await response.data;
      setDataRandomQuote(result);
      setIsLoading(false);
    } catch (error) {
      console.log("THERE IS AN ERROR :", error);
      setIsError({ error: true, status: "", statusText: "ERROR..." });
    }
  };
  const getQuotesData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const responseList = await axios.get(url);
      const resultList: QuotesList = await responseList.data;
      setDataQuotes(resultList);

      setIsLoading(true);
      for (let i = 0; i < resultList.results.length; i++) {
        let urlA = `https://api.agify.io/?name=${
          resultList.results[i].author.split(" ", 1)[0]
        }`;
        const response = await axios.get(urlA);
        const result: Age = await response.data;
        newArrAges.push(result);
      }
      setListAges(newArrAges);
      setIsLoading(false);
    } catch (error) {
      console.log("THERE IS AN ERROR :", error);
      setIsError({ error: true, status: "", statusText: "ERROR..." });
    }
  };
  return {
    isLoading,
    isError,
    getRandomQuote,
    dataRandomQuote,
    dataQuotes,
    listAges,
    getQuotesData,
  };
};
