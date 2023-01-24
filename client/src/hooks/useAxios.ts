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
      let pomArr = [];
      for (let i = 0; i < resultList.results.length; i++) {
        let urlA = `https://api.agify.io/?name=${
          resultList.results[i].author.split(" ", 1)[0]
        }`;
        pomArr.push(axios.get(urlA));
      }
      const p = await Promise.all(pomArr);
      for (let i = 0; i < p.length; i++) {
        newArrAges.push(p[i].data);
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
