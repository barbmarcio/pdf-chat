import { Pinecone } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import React from "react";

const page = async () => {
  try {
    const url = `http://localhost:3000/nvi-novo-testamento.pdf`;
    const response = await fetch(url);

    const blob = await response.blob();
    const loader = new PDFLoader(blob);

    const pageLevelDocs = await loader.load();
    const pagesAmt = pageLevelDocs.length;

    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const pineconeIndex = pinecone.index("quill");

    // const textSplitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 1000,
    //   chunkOverlap: 10,
    // });

    // const texts = await textSplitter.splitDocuments(pageLevelDocs);
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // pineconeIndex.upsert(pageLevelDocs);

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      maxConcurrency: 5,
      namespace: "123",
    });
    console.log("success");
  } catch (err) {
    console.error(err);
    console.error("failed");
  }
  return <div>page</div>;
};

export default page;
