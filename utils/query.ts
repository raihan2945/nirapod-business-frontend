export const generateQueryArray = (queries: any) => {
  let returnArray: any = [];
  Object.keys(queries).map((key) => {
    if (queries[key]) {
      const type = typeof queries[key];

      if (type == "string" && queries[key].toLowerCase() !== "all") {
        returnArray.push({ title: key, value: queries[key] });
      } else if(type !== "string") {
        returnArray.push({ title: key, value: queries[key] });
      }

    }

  });

  return returnArray;
};

export const generateUrlQueryString = (queries: any, recUrl: string) => {
  let url: string = recUrl;

  if (queries) {
    queries.map((q: any, index: number) => {
      if (index == 0) {
        url = url + `?${q?.title}=${encodeURIComponent(q?.value)}`;
      } else {
        url = url + `&${q?.title}=${encodeURIComponent(q?.value)}`;
      }
    });
  }

  return url;
};
