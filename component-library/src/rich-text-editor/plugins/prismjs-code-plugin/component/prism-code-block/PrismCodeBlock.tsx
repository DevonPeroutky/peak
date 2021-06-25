import React from "react";
import { SPRenderElementProps } from "@udecode/slate-plugins";
import "./prism-code-block.scss";

import 'prismjs/components/prism-javascript.min';
import 'prismjs/components/prism-java.min';
import 'prismjs/components/prism-typescript.min';
import 'prismjs/components/prism-scala.min';
import 'prismjs/components/prism-clike.min';
import 'prismjs/components/prism-python.min';
import 'prismjs/components/prism-bash.min';
import 'prismjs/components/prism-sass.min';
import 'prismjs/components/prism-ruby.min';
import 'prismjs/components/prism-css.min';
import 'prismjs/components/prism-sql.min';
import 'prismjs/components/prism-json.min';
import 'prismjs/components/prism-rust.min';
import 'prismjs/components/prism-yaml.min';
import 'prismjs/components/prism-xml-doc.min';
import 'prismjs/components/prism-handlebars.min';
import 'prismjs/components/prism-go.min';
import 'prismjs/components/prism-csharp.min';
import 'prismjs/components/prism-elixir.min';
import 'prismjs/components/prism-batch.min';
import 'prismjs/components/prism-bash.min';

export const PrismCodeBlock = (props: SPRenderElementProps) => {
  const { attributes, element, children } = props
  const language: string = element.language || `java`

  return (
      <pre className={`language-${language}`} {...attributes}>
          <code>{children}</code>
      </pre>
  )
}
