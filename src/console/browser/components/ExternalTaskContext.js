/*eslint-disable no-console*/
import DecisionDrawer from './DecisionDrawer';
import ExternalImageContextCard from './ExternalImageContextCard';
import ImageModerationInstructions from './ImageModerationInstructions';
import SplitPane from './SplitPane';
import ReactMarkdown from 'react-markdown';
import colors from '../colors';
import images from '../images';
import Icon from './Icon';
import React from 'react';
import Spinner from './Spinner';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/react-accessible-accordion.css';

/**TODO
Come up with usable keys for choosing instruction components
based on external task type. Currently the component choice
is hardcoded.

const EXTERNAL_TASK_INSTRUCTIONS = {
  'Image Moderation': ImageModerationInstructions
};
*/

@graphql(
  gql`
    query ExternalTaskContext($externalTaskId: ID!) {
      externalTask(id: $externalTaskId) {
        id
        type
        instructions
        exampleGroups {
          name
          markdown
        }
        decisionLabels
        image {
          id
        }
      }
    }
  `
)
@graphql(
  gql`
    mutation AddExternalTaskDecision(
      $externalTaskId: ID!
      $label: String!
      $score: Float
      $reasons: [String!]!
      $metadata: JSON
    ) {
      addExternalTaskDecision(
        id: $externalTaskId
        label: $label
        score: $score
        reasons: $reasons
        metadata: $metadata
      ) {
        ok
      }
    }
  `,
  { name: 'addExternalTaskDecision' }
)
export default class ExternalTaskContext extends React.Component {
  state = { submitting: false };

  handleChangeDecision = async ({ label, score, reasons }) => {
    const {
      externalTaskId,
      metadata,
      addExternalTaskDecision,
      onChangeDecision
    } = this.props;

    this.setState({ submitting: true });

    console.log('ExternalTask Decision Change Submitting... ', label);

    addExternalTaskDecision({
      variables: { externalTaskId, label, score, reasons, metadata }
    });
    console.log('ExternalTask Decision Changed!', label);

    if (onChangeDecision) {
      onChangeDecision({ externalTaskId, label, score, reasons, metadata });
    }
  };

  render() {
    const { preview } = this.props;
    const { externalTask } = this.props.data;
    const { submitting } = this.state;

    if (externalTask) {
      return (
        <div className="external-task-context">
          <SplitPane
            fixed
            localStorageKey="sidebar"
            minSplit={200}
            maxSplit={800}
            defaultSplit={600}
            fullWidth
            dark
          >
            <div className="cards">
              {externalTask.image && (
                <ExternalImageContextCard
                  title={null}
                  imageId={externalTask.image.id}
                />
              )}

              <DecisionDrawer
                disable={preview || submitting}
                drawerLabels={externalTask.decisionLabels}
                onChangeDecision={this.handleChangeDecision}
                decisionSubmitting={submitting}
                dark
              />
            </div>
            <div className="sidebar">
              <div className="instructions">
                <ImageModerationInstructions externalTask />
              </div>
              <div className="example-groups">
                <div className="header">
                  <div className="title">Examples of dirty content</div>
                  <div className="subtitle">
                    If any of these examples appear in the image, it is dirty!
                  </div>
                </div>
                <Accordion>
                  {externalTask.exampleGroups.map((exampleGroup, i) => (
                    <AccordionItem
                      className="example-group"
                      hideBodyClassName="collapsed"
                      key={i}
                      expanded={exampleGroup.name == 'High Priority'}
                    >
                      <AccordionItemTitle className="example-group-name">
                        <h3>
                          <span className="red">&#x2718;</span>{' '}
                          {exampleGroup.name}
                        </h3>
                        <div className="expand icon">
                          <Icon
                            style={{ display: 'inherit' }}
                            name="arrow-expand-down"
                          />
                        </div>
                        <div className="collapse icon">
                          <Icon
                            style={{ display: 'inherit' }}
                            name="arrow-collapse-up"
                          />
                        </div>
                      </AccordionItemTitle>
                      <AccordionItemBody className="example-group-markdown">
                        <ReactMarkdown source={exampleGroup.markdown} />
                      </AccordionItemBody>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </SplitPane>
          <style jsx>{`
            .external-task-context {
              display: flex;
              flex-direction: row;
            }

            .sidebar {
              height: 100vh;
              overflow-y: scroll;
              background: ${colors.black};
              padding: 20px;
              border-right: 1px solid ${colors.gray3};
              color: ${colors.gray3};
              z-index: 1;
            }

            ::-webkit-scrollbar {
              -webkit-appearance: none;
              width: 7px;
            }
            ::-webkit-scrollbar-thumb {
              border-radius: 4px;
              background-color: rgba(255, 255, 255, 0.5);
              -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
            }

            .sidebar :global(h1) {
              font-weight: bold;
              margin-bottom: 20px;
            }

            .sidebar :global(h2) {
              font-weight: bold;
              margin: 20px 0 5px;
            }

            .sidebar :global(ul) {
              margin: 5px 0 5px 20px;
              list-style-type: disc;
            }

            .sidebar :global(ul ul) {
              list-style-type: circle;
              margin: 0 0 5px 20px;
            }

            .instructions :global(p) {
              margin-top: 20px;
            }

            .example-groups {
              margin-top: 20px;
            }

            .example-groups .header {
              margin-bottom: 10px;
            }

            .example-groups .title {
              font-size: 2em;
            }

            .example-groups :global(.example-group) {
              position: relative;
              color: ${colors.black2};
              background: ${colors.gray3};
              border-radius: 4px;
            }

            .example-groups .icon {
              color: ${colors.gray1};
            }

            .example-groups :global(.example-group:hover) .icon {
              color: ${colors.black2};
            }

            .example-groups .collapse {
              display: block;
            }

            .example-groups .expand {
              display: none;
            }

            .example-groups :global(.example-group.collapsed) .collapse {
              display: none;
            }

            .example-groups :global(.example-group.collapsed) .expand {
              display: block;
            }

            .example-groups :global(.example-group + .example-group) {
              margin-top: 10px;
            }

            .example-groups :global(.example-group-name) {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 1.1rem;
              font-weight: 700;
              padding: 5px 7px;
              cursor: pointer;
            }

            .example-groups :global(.example-group-markdown > div > p) {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              flex-wrap: wrap;
              padding: 5px;
            }

            .example-groups :global(.example-group-markdown img) {
              width: 50%;
              padding: 5px;
            }

            .cards {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              height: 100vh;
              background-color: ${colors.black};
              background-image: ${images.checkerPatternBase64};
              background-clip: border-box;
              background-origin: padding-box;
              background-attachment: scroll;
              background-repeat: repeat;
              background-size: auto;
              background-position: left top;
            }

            .red {
              color: ${colors.red};
            }
          `}</style>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}
