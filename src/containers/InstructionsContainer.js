import React, { Component } from 'react';
import StepTile from '../components/StepTile';
import ItemTile from '../components/ItemTile';
import FetchButton from '../components/FetchButton';

class InstructionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    }

    this.setSelectedStep = this.setSelectedStep.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  setSelectedStep(id) {
    let data = Object.assign({}, this.state.data)
    data.id = id
    this.setState({ data: data })
  }

  fetchData() {
    fetch('/api/v1/favorite_things.json')
      .then(response => {
        return response.text()
      })
      .then(json => {
        return JSON.parse(json)
      })
      .then(data => {
        return this.setState({ data: data })
      })
      .catch(error => {
        console.error(`Error in fetch: ${error.message}`)
      })
  }

  render() {
    let data = this.state.data

    if (data == null) {
      return(
        <div>
          <FetchButton fetchData={this.fetchData}/>
        </div>
      )
    } else {
      let supplies = data.supplies
      let directions = data.directions

      let items = supplies.map(supply => {
        return(
          <ItemTile
            item={supply.item}
            key={supply.id}
            id={supply.id}
          />
        )
      })

      let steps = directions.map(direction => {
        let className;
        if (data.id == direction.id) {
          className = "selected"
        }

        return(
          <StepTile
            step={direction.step}
            key={direction.id}
            id={direction.id}
            setSelectedStep={this.setSelectedStep}
            className={className}
          />
        )
      })

      return(
        <div>
          <h1>How To {data.activity}</h1>
          <h3>Supplies:</h3>
          <ul>
            {items}
          </ul>
          <h3>Instructions:</h3>
          <ol>
            {steps}
          </ol>
          <FetchButton fetchData={this.fetchData}/>
        </div>
      )
    }
  }
}

export default InstructionsContainer;
