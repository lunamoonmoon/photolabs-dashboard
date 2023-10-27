import React, { Component } from "react";

import classnames from "classnames";
import { getTotalPhotos, getTotalTopics, getUserWithLeastUploads, getUserWithMostUploads } from "helpers/selectors";
import Loading from "./Loading";
import Panel from "./Panel";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithLeastUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithMostUploads
  }
];

class Dashboard extends Component {
  state = {
    photos: [],
    topics: [],
    loading: true,
    focused: null
  };

  componentDidMount() {
    const urlsPromise = [
      "/api/photos",
      "/api/topics",
    ].map(url => fetch(url).then(res => res.json()));

    Promise.all(urlsPromise)
    .then(([photos, topics]) => {
      this.setState({
        loading: false,
        photos: photos,
        topics: topics
      });
    });

    const focused = JSON.parse(localStorage.getItem("focused"));
    if (focused) {
      this.setState({focused});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  selectPanel(id) {
    this.setState(prevState => ({
     focused: prevState.focused !== null ? null : id
    }));
   }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    if (this.state.loading) {
      return <Loading />;
    }

    const panels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
    .map(panel => (
     <Panel
      key={panel.id}
      label={panel.label}
      value={panel.getValue(this.state)}
      onSelect={() => this.selectPanel(panel.id)}
     />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
