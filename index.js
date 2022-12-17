import * as dotenv from "dotenv";
import fetch from "node-fetch";
import cc from "currency-codes";
import getSymbolFromCurrency from "currency-symbol-map";

dotenv.config();

const App = () => {
  const getData = async () => {
    let total = 0;
    const req = await fetch(
      `https://api.monobank.ua/personal/statement/${
        process.env.MONO_JAR
      }/${Math.round((Date.now() - 2629800000) / 1000)}`,
      {
        headers: {
          "X-Token": process.env.MONO_TOKEN,
        },
      }
    );

    const data = await req.json();

    if (!data || !data.length || data.length === 0) return console.log("error");

    data.reverse().map((item, key) => {
      const { comment, description, amount, currencyCode, balance } = item;
      key === 0 && console.clear();
      console.log(
        description.replace("Від:", "👋🏻 FROM:"),
        "...",
        (amount / 100).toLocaleString(),
        getSymbolFromCurrency(cc.number(currencyCode).code)
      );
      comment && console.log(comment);
      console.log("\n* * *\n");
      total = { balance, currencyCode };
    });

    console.log(
      "TOTAL DONATIONS: .................",
      (total.balance / 100).toLocaleString(),
      getSymbolFromCurrency(cc.number(total.currencyCode).code)
    );
  };

  getData();

  setInterval(getData, 60000);
};

App();
