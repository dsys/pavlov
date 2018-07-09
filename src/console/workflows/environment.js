/**
 * Module that contains functions related to workflow environments.
 *
 * Right now, Cleargraph only uses two environments: LIVE and TEST. As their names suggest, they are for production and staging respectively. They are entirely separate, with independent settings and target key namespaces. Aside from that, they are identical.
 *
 * @flow
 */

export type Environment = 'LIVE' | 'TEST';
