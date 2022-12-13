/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ComponentType } from 'react';
import {
  EntityPeekAheadPopover,
  EntityPeekAheadPopoverProps,
} from './EntityPeekAheadPopover';
import Button from '@material-ui/core/Button';
import { wrapInTestApp, TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef } from '../../api';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { entityRouteRef } from '../../routes';
import { CatalogApi } from '@backstage/catalog-client';

const mockCatalogApi = {
  getEntityByRef: async (entityRef: CompoundEntityRef) => {
    if (
      entityRef.namespace === 'default' &&
      entityRef.name === 'playback' &&
      entityRef.kind === 'component'
    ) {
      return {
        kind: 'Component',
        metadata: {
          name: 'playback',
          namespace: 'default',
          description: 'Details about the playback service',
        },
      };
    }
    if (
      entityRef.namespace === 'default' &&
      entityRef.name === 'fname.lname' &&
      entityRef.kind === 'user'
    ) {
      return {
        kind: 'User',
        metadata: {
          name: 'fname.lname',
          namespace: 'default',
        },
        spec: {
          profile: {
            email: 'fname.lname@example.com',
          },
        },
      };
    }
    if (
      entityRef.namespace === 'default' &&
      entityRef.name === 'slow.catalog.item' &&
      entityRef.kind === 'component'
    ) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      return {
        kind: 'Component',
        metadata: {
          name: 'slow.catalog.item',
          namespace: 'default',
          description: 'Details about the slow.catalog.item service',
        },
      };
    }
    return undefined;
  },
};

const defaultArgs = {
  entityRef: 'component:default/playback',
};

export default {
  title: 'Catalog /PeekAheadPopover',
  decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(
        <>
          <TestApiProvider
            apis={[[catalogApiRef, mockCatalogApi as any as CatalogApi]]}
          >
            <Story />
          </TestApiProvider>
        </>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      ),
  ],
};

export const Default = (args: EntityPeekAheadPopoverProps) => (
  <EntityPeekAheadPopover {...args}>
    <Button>Hover over me to see details about this component</Button>
  </EntityPeekAheadPopover>
);
Default.args = defaultArgs;

export const User = (args: EntityPeekAheadPopoverProps) => (
  <EntityPeekAheadPopover {...args}>
    <Button>Hover over me to see details about this user</Button>
  </EntityPeekAheadPopover>
);
User.args = {
  entityRef: 'user:default/fname.lname',
};

export const NotFound = (args: EntityPeekAheadPopoverProps) => (
  <EntityPeekAheadPopover {...args}>
    <Button>Hover over me to see details about this not found entity</Button>
  </EntityPeekAheadPopover>
);
NotFound.args = {
  entityRef: 'user:default/doesnt.exist',
};

export const SlowCatalogItem = (args: EntityPeekAheadPopoverProps) => (
  <EntityPeekAheadPopover {...args}>
    <Button>Hover over me to see details about this slow entity</Button>
  </EntityPeekAheadPopover>
);
SlowCatalogItem.args = {
  entityRef: 'component:default/slow.catalog.item',
};
