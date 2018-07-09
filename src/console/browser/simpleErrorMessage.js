export default function simpleErrorMessage(err) {
  return (err.graphQLErrors && err.graphQLErrors.length > 0
    ? err.graphQLErrors[0]
    : err
  ).message;
}
