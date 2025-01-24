function template(
  {imports, interfaces, componentName, props, jsx, exports},
  {tpl},
) {
  return tpl`${imports}
  ${interfaces}
  
  const SvgItem = (${props}) => ${jsx}
  
  const systemProps = {
    fill: { property: 'fill', scale: 'colors' },
    stroke: { property: 'stroke', scale: 'colors' },
    color: { property: 'color', scale: 'colors' },
  }
  
  function ${componentName}({ color, fill, stroke, ...props}) {
  
    return (
      <View {...pick(props)}>
        <SvgItem {...props}/>
      </View>
    );
  }
  ${exports}
  `;
}

module.exports = template;
