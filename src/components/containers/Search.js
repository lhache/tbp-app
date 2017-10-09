import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import SearchForm from '../presentational/SearchForm'
import TagAutocomplete from '../presentational/TagAutocomplete'
import Flexbox from 'flexbox-react';
import { storeTerm, storeSearchedTerm } from '../../data/modules/searchResults'
import { Link } from 'react-router-dom'
import { isDeviceConsideredMobile } from '../../data/utils'
import { parseQueryString } from '../../data/utils'
import { searchURL, resultsURL } from '../../data/urls'
import { getOrCreateElementById } from '../../utils/domUtils'
import { joinTermToStringWithSymbol } from '../../utils/appUtils'
import './Search.css';

const showMobileSearch = (term, that) => {


  if (/search/i.test(window.location.pathname)) {
    return (
      <SearchForm
        term={term}
        onChange={that.handleChange.bind(that)}
        onSubmit={that.handleSubmit.bind(that)}
      />
    )
  }
  else {
    return (
      <Link to={`${searchURL}?q=${joinTermToStringWithSymbol(term, ',')}`} className="SearchLink">
        <TagAutocomplete
          value={term}
          onChange={that.handleChange.bind(that)}
          disabled={true}
        />
      </Link>
    )
  }
}

const showDesktopSearch = (term, that) => (
  <SearchForm
    term={term}
    onChange={that.handleChange.bind(that)}
    onSubmit={that.handleSubmit.bind(that)}
  />
)

class SearchContainer extends Component {

  componentDidMount() {
    // set searchedTerm and fetch results at page load
    const queries = parseQueryString(this.props.history.location.search);
    let term = queries['q'];

    if (term) {
      term = term.split(',').map(t => ({id: t, name: t}))
      this.props.storeTerm(term)
      this.props.storeSearchedTerm(term)
    }
  }

  handleSubmit(term) {
    const history = this.props.history;
    const termForURL = term.map(t => t.name).join(',')
    history.push({
      pathname: `${resultsURL}`,
      search: `?q=${termForURL}`,
      state: { term }
    })
  }

  handleChange(term) {
    this.props.storeTerm(term)
  }

  render() {
    const { term } = this.props

    return ReactDOM.createPortal(
      <Flexbox flexBasis="100%" flexWrap="wrap" className="SearchContainer">
        { isDeviceConsideredMobile() ? showMobileSearch(term, this) : showDesktopSearch(term, this)}
      </Flexbox>,
      getOrCreateElementById('div', { id: 'SearchContainer'})
    )
  }
}

SearchContainer.propTypes = {
  term: PropTypes.array.isRequired,
  storeTerm: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    term: state.searchResults.term
  }
}

const mapDispatchToProps = dispatch => {
  return {
    storeTerm: term => {
      dispatch(storeTerm(term))
    },
    storeSearchedTerm: term => {
      dispatch(storeSearchedTerm(term))
    }
  }
}

const Search = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer))

export default Search;
