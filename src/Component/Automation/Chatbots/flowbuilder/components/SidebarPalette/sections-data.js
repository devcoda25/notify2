
import { NODE_COLORS } from '../../lib/color-utils';
import { nanoid } from 'nanoid';

export const SECTION_DATA = [
    {
      key: 'triggers',
      title: 'Triggers',
      items: [
          { key: 'keyword', label: 'Keyword',  icon: 'AtSign', type: 'triggers',   color: NODE_COLORS[0], description: 'Triggered by a specific keyword' },
          { key: 'default_action', label: 'Default Action',  icon: 'PlayCircle', type: 'triggers',   color: NODE_COLORS[0], description: 'Default flow for new conversations' },
      ]
    },
    {
      key: 'messaging',
      title: 'Messaging',
      items: [
          { key: 'message', label: 'Send a Message', icon: 'Send', type: 'messaging', color: NODE_COLORS[1], description: 'Send text, media, or interactive messages' },
          { key: 'askQuestion', label: 'Question', icon: 'HelpCircle', type: 'inputs', color: NODE_COLORS[2], description: 'Ask an open-ended question and wait for a reply' },
          { key: 'buttons', label: 'Buttons', icon: 'MessageSquarePlus', type: 'inputs', color: NODE_COLORS[1], description: 'Ask a question with up to 10 buttons', content: 'Ask a question here', quickReplies: [{ id: nanoid(), label: 'Answer 1' }, { id: nanoid(), label: 'Default' }] },
          {
            key: 'list',
            label: 'List',
            icon: 'List',
            type: 'inputs',
            color: NODE_COLORS[1],
            description: 'Ask a question with a list of up to 10 choices',
            content: 'default body',
            list: {
              content: 'default body',
              footerText: '',
              buttonText: 'Menu Here',
              variableName: '@value',
              sections: [
                {
                  id: nanoid(),
                  title: 'Section 1',
                  items: [
                    { id: nanoid(), title: 'default row', description: '' },
                  ]
                }
              ]
            }
          },
      ]
    },
    {
      key: 'logic',
      title: 'Logic & Flow',
      items: [
          { key: 'condition', label: 'Set a Condition', icon: 'GitFork', type: 'logic', color: NODE_COLORS[0], description: 'Branch the flow based on conditions' },
          { key: 'delay', label: 'Add a Delay', icon: 'Timer', type: 'logic', color: NODE_COLORS[0], description: 'Pause the flow for a specific duration' },
      ]
    },
    {
      key: 'integrations',
      title: 'Integrations',
      items: [
          { key: 'apiCallout', label: 'Webhook', icon: 'Webhook', type: 'integrations', color: NODE_COLORS[3], description: 'Make an HTTP request to an external service' },
      ]
    },
    {
      key: 'handoff',
      title: 'Handoff',
      items: [
          { key: 'assignTeam', label: 'Assign to Team', icon: 'Users', type: 'handoff', color: NODE_COLORS[4], description: 'Assign the conversation to a team' },
          { key: 'assignUser', label: 'Assign to User', icon: 'User', type: 'handoff', color: NODE_COLORS[4], description: 'Assign the conversation to a specific user' },
      ]
    },
    {
      key: 'flow',
      title: ' ',
      items: [
          { key: 'end', label: 'End of Flow', icon: 'FlagOff', type: 'end', color: NODE_COLORS[0], description: 'Explicitly terminate the flow' },
      ]
    }
  ];
