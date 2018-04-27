import React from 'react';

//instead of using usual search for mwith submit bugtton, make use of auto-complete component
import Autocomplete from 'react-autocomplete';

class Search extends React.Component{

handleRenderItem(item, isHighlighted){

  //if it's highlighted, use the list.Styles.highlightedItem,
  //if not, use the other one.
  const listStyles = {
    item: {
      padding: '2px 6px',
      cursor: 'default'
    },

    highlightedItem: {
      color: 'white',
      background: '#F38B72',
      padding: '2px 6px',
      cursor: 'default'
    }
  };

  return (
    <div
      style = { isHighlighted ? listStyles.highlightedItem : listStyles.item }
      key = { item.id }
      id = { item.id }
    > { item.title } </div>
  )
}

  //autocomplete with value and behaviro handled via this.props
  //array of tracks passed through
  render(){
    return (
      <div className = 'search'>
        <Autocomplete
          ref = 'autocomplete'
          inputProps = {{title: 'Title'}}
          value = { this.props.autoCompleteValue }
          items = { this.props.tracks }
          getItemValue ={ (item) => item.title }
          onSelect = { this.props.handleSelect }
          onChange = { this.props.handleChange }
          renderItem = { this.handleRenderItem.bind(this) }
        />
      </div>
    );
  }
}

export default Search;
