import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { utils } from 'github-url-detection';
import { isPerceptor, runsWhen } from '../utils/utils';
import PerceptorBase from '../pages/ContentScripts/PerceptorBase';
import { inject2Perceptor } from '../pages/ContentScripts/Perceptor';
import { loadSettings } from '../utils/settings';
import ProjectNetworkView from '../views/ProjectNetwork';

@runsWhen([isPerceptor])
class ProjectNetwork extends PerceptorBase {
  private _currentRepo: string;

  constructor() {
    super();
    this._currentRepo = '';
  }
  public async run(): Promise<void> {
    const perceptorContainer = $('#perceptor-layout').children();
    const ProjectNetworkDiv = document.createElement('div');
    ProjectNetworkDiv.id = 'project-network';
    ProjectNetworkDiv.style.width = '100%';
    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;
    const settings = await loadSettings();
    render(
      <ProjectNetworkView
        currentRepo={this._currentRepo}
        graphType={settings.graphType}
      />,
      ProjectNetworkDiv
    );
    perceptorContainer.prepend(ProjectNetworkDiv);
  }
}

export default ProjectNetwork;