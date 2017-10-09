import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { fetchResults, storeTerm, storeSearchedTerm }  from '../../data/modules/searchResults'
import ResultsHeadline from '../presentational/ResultsHeadline'
import Loader from '../presentational/Loader'
import Product from '../presentational/Product'
import Flexbox from 'flexbox-react';
import { parseQueryString } from '../../data/utils'
import './Results.css';

const showLoader = isFetching => (isFetching && <Loader />)

const showError = hasFailedFetching => (hasFailedFetching && <p>error</p>)

const showResults = (results, isFetching, hasFailedFetching) => ((!isFetching && !hasFailedFetching) && (
  <Flexbox maxWidth="100%" flexWrap="wrap" justifyContent="center">
      {results.map((result, idx) => (
        <Flexbox key={result.id} order={idx}>
          <Product product={result} />
        </Flexbox>
      ))}
  </Flexbox>
))

class ResultsContainer extends Component {

  componentDidMount() {
    // set searchedTerm and fetch results at page load
    const queries = parseQueryString(this.props.history.location.search);
    let term = queries['q'];

    if (term) {
      this.props.fetchResults(term)
    }
  }

  componentWillReceiveProps(nextProps) {
    // set searchedTerm and fetch results at form submission
    // if (this.props.searchedTerm !== nextProps.searchedTerm) {
    //   this.props.fetchResults(nextProps.searchedTerm)
    // }
  }

  render() {
    const {results, isFetching, hasFailedFetching, searchedTerm} = this.props

    return (
      <Flexbox flexWrap="wrap" className="ResultsContainer" maxWidth="100%">
        <ResultsHeadline type="results" term={searchedTerm} />
        { showLoader(isFetching) }
        { showError(hasFailedFetching) }
        { showResults(results, isFetching, hasFailedFetching) }
      </Flexbox>
    )
  }
}

ResultsContainer.propTypes = {
  term : PropTypes.array.isRequired,
  searchedTerm : PropTypes.array.isRequired,
  results: PropTypes.array.isRequired,
  fetchResults: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    term: state.searchResults.term,
    searchedTerm: state.searchResults.searchedTerm,
    results: state.searchResults.results,
    isFetching: state.searchResults.isFetching,
    hasFailedFetching: state.searchResults.hasFailedFetching
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchResults: term => {
      dispatch(fetchResults(term))
    },
    storeTerm: term => {
      dispatch(storeTerm(term))
    },
    storeSearchedTerm: term => {
      dispatch(storeSearchedTerm(term))
    }
  }
}

const Results = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsContainer))

export default Results;
