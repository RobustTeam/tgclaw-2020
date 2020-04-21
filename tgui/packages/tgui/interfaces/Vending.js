import { classes } from 'common/react';
import { Fragment } from 'inferno';
import { useBackend } from '../backend';
import { Box, Button, Section, Table } from '../components';

export const Vending = props => {
  const { act, data } = useBackend(props);
  let inventory;
  let custom = false;
  if (data.vending_machine_input) {
    inventory = data.vending_machine_input;
    custom = true;
  } else if (data.extended_inventory) {
    inventory = [
      ...data.product_records,
      ...data.coin_records,
      ...data.hidden_records,
    ];
  } else {
    inventory = [
      ...data.product_records,
      ...data.coin_records,
    ];
  }
  return (
    <Fragment>
      {!!data.onstation && (
        <Section title="User">
          {data.user && (
            <Box>
              Welcome, <b>{data.user.name}</b>,
              {' '}
              <b>{data.user.job || "Unemployed"}</b>!
              <br />
              Your balance is <b>{data.user.cash} credits</b>.
            </Box>
          ) || (
            <Box color="light-gray">
              No registered ID card!<br />
              Please contact your local HoP!
            </Box>
          )}
        </Section>
      )}
      <Section title="Products" >
        <Table>
          {inventory.map((product => {
            const free = (
              !data.onstation
              || product.price === 0
              || (
                !product.premium
                && data.department
                && data.user
                && data.department === data.user.department
              )
            );
            return (
              <Table.Row key={product.name}>
                <Table.Cell collapsing>
                  {product.base64 ? (
                    <img
                      src={`data:image/jpeg;base64,${product.img}`}
                      style={{
                        'vertical-align': 'middle',
                        'horizontal-align': 'middle',
                      }} />
                  ) : (
                    <span
                      className={classes([
                        'vending32x32',
                        product.path,
                      ])}
                      style={{
                        'vertical-align': 'middle',
                        'horizontal-align': 'middle',
                      }} />
                  )}
                </Table.Cell>
                <Table.Cell bold>
                  {product.name}
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                  <Box
                    color={custom
                      ? 'good'
                      : data.stock[product.name] <= 0
                        ? 'bad'
                        : data.stock[product.name] <= (product.max_amount / 2)
                          ? 'average'
                          : 'good'}>
                    {data.stock[product.name]} in stock
                  </Box>
                </Table.Cell>
                <Table.Cell collapsing textAlign="center">
                  {custom && (
                    <Button
                      content={data.access ? 'FREE' : product.price + ' cr'}
                      onClick={() => act('dispense', {
                        'item': product.name,
                      })} />
                  ) || (
                    <Button
                      disabled={(
                        data.stock[product.namename] === 0
                        || (
                          !free && (
                            !data.user
                            || product.price > data.user.cash
                          )
                        )
                      )}
                      content={free ? 'FREE' : product.price + ' cr'}
                      onClick={() => act('vend', {
                        'ref': product.ref,
                      })} />
                  )}
                </Table.Cell>
              </Table.Row>
            );
          }))}
        </Table>
      </Section>
    </Fragment>
  );
};
