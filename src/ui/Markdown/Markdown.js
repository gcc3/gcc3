import React from "react";
import { marked } from "marked";

// In Markdown, resolve the baseUrl for relative URLs (e.g. images).
const resolveRelativeUrlsIn = (html, basePath) => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return html;
  }

  const template = document.createElement("template");
  template.innerHTML = html;
  template.content.querySelectorAll("img[src]").forEach(element => {
    const attributeValue = element.getAttribute("src");
    if (!attributeValue) {
      return;
    }
    element.setAttribute("src", basePath + attributeValue);
  });
  return template.innerHTML;
};

const Markdown = ({ children, basePath = "/" }) => {
  const renderer = new marked.Renderer();
  const resolvedHtml = resolveRelativeUrlsIn(marked.parse(children, { renderer }), basePath);
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: resolvedHtml
      }}
    />
  );
};

export default Markdown;
