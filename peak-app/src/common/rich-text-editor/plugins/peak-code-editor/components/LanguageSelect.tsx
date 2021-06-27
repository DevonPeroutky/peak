import React from "react";
import cn from "classnames";
import {Select} from "antd";
import {capitalize} from "lodash";
const { Option } = Select;

interface LanguageSelectProps {
    updateLanguage: (newLanguage: string) => void,
    language: string,
}

export function LanguageSelect(props: LanguageSelectProps) {
    const { updateLanguage, language } = props
    return (
        <Select
            defaultValue={capitalize(language)}
            className={"peak-language-select"}
            bordered={false}
            dropdownMatchSelectWidth={120}
            onChange={(language: string) => {
                updateLanguage(language)
            }}>
            <Option value="javascript">Javascript</Option>
            <Option value="java">Java</Option>
            <Option value="scala">Scala</Option>
            <Option value="python">Python</Option>
            <Option value="batch">Batch</Option>
            <Option value="bash">Bash</Option>
            <Option value="typescript">Typescript</Option>
            <Option value="sass">Sass</Option>
            <Option value="ruby">Ruby</Option>
            <Option value="css">Css</Option>
            <Option value="mysql">Mysql</Option>
            <Option value="json">Json</Option>
            <Option value="handlebars">Handlebars</Option>
            <Option value="golang">Golang</Option>
            <Option value="csharp">Csharp</Option>
            <Option value="elixir">Elixir</Option>
        </Select>
    )
}