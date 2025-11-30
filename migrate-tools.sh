#!/bin/bash

# Batch migration script for remaining tools
# This script will migrate all remaining tools to use ToolPageLayout

files=(
  "src/pages/tools/developer/CronParser.tsx"
  "src/pages/tools/developer/CssMinifier.tsx"
  "src/pages/tools/developer/HtmlMinifier.tsx"
  "src/pages/tools/developer/HttpStatusCodes.tsx"
  "src/pages/tools/developer/ImageBase64Converter.tsx"
  "src/pages/tools/developer/JsMinifier.tsx"
  "src/pages/tools/developer/MetaTagGenerator.tsx"
  "src/pages/tools/developer/UserAgentParser.tsx"
  "src/pages/tools/converters/JsonCsvConverter.tsx"
  "src/pages/tools/converters/JsonToSchemaConverter.tsx"
  "src/pages/tools/converters/JsonXmlConverter.tsx"
  "src/pages/tools/converters/JsonYamlConverter.tsx"
  "src/pages/tools/formatters/JsonSchemaValidator.tsx"
  "src/pages/tools/formatters/XmlFormatter.tsx"
  "src/pages/tools/formatters/YamlFormatter.tsx"
  "src/pages/tools/generators/HashGenerator.tsx"
  "src/pages/tools/generators/QrCodeGenerator.tsx"
  "src/pages/tools/generators/UuidGenerator.tsx"
  "src/pages/tools/json/JsonFormatter.tsx"
  "src/pages/tools/calculators/PercentageCalculator.tsx"
)

echo "Files to migrate: ${#files[@]}"
for file in "${files[@]}"; do
  echo "- $file"
done
