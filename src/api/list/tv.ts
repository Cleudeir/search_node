/* eslint-disable array-callback-return */
import asyncCrawlerSingle from "../../components/asyncCrawler";
import { DataTv, episode } from "../../components/interfaces";
import cache from "../../components/cache";
import fetch from "node-fetch";

function formatNumberWithDigits(num: number): string {
  return num.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

async function geTv(url: string): Promise<episode[] | null> {
  const doc1: any = await asyncCrawlerSingle(url);
  if (!doc1) {
    return null;
  }
  const response: { url: string, name: string }[] = [];
  let count = 0
  doc1.querySelectorAll("a").forEach((x: {
    [x: string]: any
  }) => {
    //console.log(x.parentElement?.previousElementSibling?.previousElementSibling?.innerHTML || "error");
    let nameInner;
    if (x.previousElementSibling?.innerHTML?.includes("Episódio")) {
      nameInner = x.previousElementSibling.innerHTML.replace(/[^0-9]/g, "")
    } else if (x.parentElement.previousElementSibling?.innerHTML?.includes("Episódio")) {
      nameInner = x.parentElement?.previousElementSibling?.innerHTML?.replace(/[^0-9]/g, "")
    } else if (x.parentElement.previousElementSibling?.previousElementSibling?.innerHTML?.includes("Episódio")) {
      nameInner = x.parentElement?.previousElementSibling?.previousElementSibling?.innerHTML?.replace(/[^0-9]/g, "")
    }
    if (
      (x.innerHTML === "<strong>Assistir</strong>" ||
        x.innerHTML === "<strong>Dublado</strong>" ||
        x.innerHTML === "Dublado" ||
        x.innerHTML === "Assistir") &&
        !x.href.includes('/browse')
    ) {
      if (nameInner) {
        if (nameInner.includes("1") && nameInner.length === 1 || nameInner.includes("01") && nameInner.length === 2 || nameInner.includes("001") && nameInner.length === 3 ) {
          count++
        }
        response.push({
          url: x.href,
          name: 'T' + count + '-EP' + nameInner,
        });
      } else {
        response.push({
          url: x.href,
          name: "FILLER-" + String(response.length + 1),
        });
      }
    }
    else if (
      x.innerHTML === "<strong>Legendado</strong>"
      && x.previousElementSibling.innerHTML
      && x.previousElementSibling.innerHTML.includes("Episódio")
    ) {
      const episodeNumber = x.previousElementSibling.innerHTML.replace("Episódio ", '').replace(" - ", '')
      if (episodeNumber === "01") {
        count++
      }
      response.push({
        url: x.href,
        name: 'T' + count + '-EP' + episodeNumber,
      });
    }
  });
  if (response.length === 0) {
    return null;
  }
  const episodes: episode[] = [];
  for (let i = 0; i < response.length; i++) {
    const _item = response[i];
    const item = { id: episodes.length, ..._item };
    episodes.push(item);
  }
  return episodes;
}

export default async function infoTvList(item: DataTv): Promise<episode[] | null> {
  const url = "https://redecanais.la/" + item.url + ".html";
  console.log('url: ', url);
  const episodes = await geTv(url);
  //const episodes = await cache(url, geTv);
  return episodes;
}
