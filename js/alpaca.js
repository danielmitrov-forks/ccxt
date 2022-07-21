'use strict';

//  ---------------------------------------------------------------------------

const Exchange = require ('./base/Exchange');
const { ExchangeError, InvalidOrder, BadRequest, InsufficientFunds, OrderNotFound, RateLimitExceeded, PermissionDenied, BadSymbol, NotSupported } = require ('./base/errors');
const { TICK_SIZE } = require ('./base/functions/number');

//  ---------------------------------------------------------------------------xs

module.exports = class alpaca extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'alpaca',
            'name': 'Alpaca',
            'countries': [ 'US' ],
            'rateLimit': 300,
            'hostname': 'alpaca.markets',
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/26471228/142237130-8f3a06c5-7e35-4fa1-9a82-28ac25795490.jpg',
                'www': 'https://alpaca.markets',
                'api': {
                    'public': 'https://api.{hostname}/{version}',
                    'private': 'https://api.{hostname}/{version}',
                    'crypto': 'https://data.{hostname}/{version}',
                },
                'test': {
                    'public': 'https://paper-api.{hostname}/{version}',
                    'private': 'https://paper-api.{hostname}/{version}',
                    'crypto': 'https://data.{hostname}/{version}',
                },
                'doc': 'https://alpaca.markets/docs/',
                'fees': 'https://alpaca.markets/support/what-are-the-fees-associated-with-crypto-trading/',
            },
            'has': {
                'CORS': false,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'createOrder': true,
                'fetchBalance': true,
                'fetchBidsAsks': false,
                'fetchClosedOrders': false,
                'fetchCurrencies': false,
                'fetchDepositAddress': false,
                'fetchDepositAddressesByNetwork': false,
                'fetchDeposits': false,
                'fetchFundingHistory': false,
                'fetchFundingRate': false,
                'fetchFundingRates': false,
                'fetchL1OrderBook': true,
                'fetchL2OrderBook': false,
                'fetchMarkets': true,
                'fetchMyTrades': false,
                'fetchOHLCV': false,
                'fetchOpenOrder': false,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchPositions': false,
                'fetchStatus': false,
                'fetchTicker': true,
                'fetchTickers': false,
                'fetchTime': false,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchTransactionFees': false,
                'fetchTransactions': false,
                'fetchTransfers': false,
                'fetchWithdrawals': false,
                'setLeverage': false,
                'setMarginMode': false,
                'transfer': false,
                'withdraw': false,
            },
            'api': {
                'public': {
                },
                'private': {
                    'get': [
                        'assets',
                        'account',
                        'orders',
                        'orders/{order_id}',
                        'positions',
                        'positions/{symbol}',
                        'account/activities/{activity_type}',
                    ],
                    'post': [
                        'orders',
                    ],
                    'delete': [
                        'orders',
                        'orders/{order_id}',
                    ],
                },
                'cryptoPublic': {
                    'get': [
                        'crypto/latest/orderbooks',
                        'crypto/trades',
                        'crypto/quotes',
                        'crypto/latest/quotes',
                        'crypto/bars',
                        'crypto/snapshots',
                    ],
                },
            },
            'precisionMode': TICK_SIZE,
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
            },
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'maker': this.parseNumber ('0.003'),
                    'taker': this.parseNumber ('0.003'),
                    'tiers': {
                        'taker': [
                            [ this.parseNumber ('0'), this.parseNumber ('0.003') ],
                            [ this.parseNumber ('500000'), this.parseNumber ('0.0028') ],
                            [ this.parseNumber ('1000000'), this.parseNumber ('0.0025') ],
                            [ this.parseNumber ('5000000'), this.parseNumber ('0.002') ],
                            [ this.parseNumber ('10000000'), this.parseNumber ('0.0018') ],
                            [ this.parseNumber ('25000000'), this.parseNumber ('0.0015') ],
                            [ this.parseNumber ('50000000'), this.parseNumber ('0.00125') ],
                            [ this.parseNumber ('100000000'), this.parseNumber ('0.001') ],
                        ],
                        'maker': [
                            [ this.parseNumber ('0'), this.parseNumber ('0.003') ],
                            [ this.parseNumber ('500000'), this.parseNumber ('0.0028') ],
                            [ this.parseNumber ('1000000'), this.parseNumber ('0.0025') ],
                            [ this.parseNumber ('5000000'), this.parseNumber ('0.002') ],
                            [ this.parseNumber ('10000000'), this.parseNumber ('0.0018') ],
                            [ this.parseNumber ('25000000'), this.parseNumber ('0.0015') ],
                            [ this.parseNumber ('50000000'), this.parseNumber ('0.00125') ],
                            [ this.parseNumber ('100000000'), this.parseNumber ('0.001') ],
                        ],
                    },
                },
            },
            'options': {
                'versions': {
                    'public': 'v2',
                    'private': 'v2',
                    'crypto': 'v1beta1', // crypto beta
                },
                'defaultExchange': 'CBSE',
                'exchanges': [
                    'CBSE', // Coinbase
                    'FTX', // FTXUS
                    'GNSS', // Genesis
                    'ERSX', // ErisX
                ],
                'defaultTimeInForce': 'day', // fok, gtc, ioc
                'clientOrderId': 'ccxt_{id}',
                'precision': { // api does not provide this information
                    'AAVE/USD': { 'amount': this.parseNumber ('0.01'), 'price': this.parseNumber ('0.01'), 'minAmount': this.parseNumber ('0.01') },
                    'ALGO/USD': { 'amount': this.parseNumber ('1'), 'price': this.parseNumber ('0.0001'), 'minAmount': this.parseNumber ('1') },
                    'AVAX/USD': { 'amount': this.parseNumber ('0.1'), 'price': this.parseNumber ('0.0005'), 'minAmount': this.parseNumber ('0.1') },
                    'BAT/USD': { 'amount': this.parseNumber ('1'), 'price': this.parseNumber ('0.01'), 'minAmount': this.parseNumber ('1') },
                    'BTC/USD': { 'amount': this.parseNumber ('0.0001'), 'price': this.parseNumber ('1'), 'minAmount': this.parseNumber ('0.0001') },
                    'BCH/USD': { 'amount': this.parseNumber ('0.0001'), 'price': this.parseNumber ('0.025'), 'minAmount': this.parseNumber ('0.001') },
                    'LINK/USD': { 'amount': this.parseNumber ('0.1'), 'price': this.parseNumber ('0.0005'), 'minAmount': this.parseNumber ('0.1') },
                    'DAI/USD': { 'amount': this.parseNumber ('0.1'), 'price': this.parseNumber ('0.0001'), 'minAmount': this.parseNumber ('0.1') },
                    'DOGE/USD': { 'amount': this.parseNumber ('1'), 'price': this.parseNumber ('0.0000005'), 'minAmount': this.parseNumber ('1') },
                    'ETH/USD': { 'amount': this.parseNumber ('0.001'), 'price': this.parseNumber ('0.1'), 'minAmount': this.parseNumber ('0.001') },
                    'GRT/USD': { 'amount': this.parseNumber ('1'), 'price': this.parseNumber ('0.00005'), 'minAmount': this.parseNumber ('1') },
                    'LTC/USD': { 'amount': this.parseNumber ('0.01'), 'price': this.parseNumber ('0.005'), 'minAmount': this.parseNumber ('0.01') },
                    'MKR/USD': { 'amount': this.parseNumber ('0.001'), 'price': this.parseNumber ('0.5'), 'minAmount': this.parseNumber ('0.001') },
                    'MATIC/USD': { 'amount': this.parseNumber ('10'), 'price': this.parseNumber ('0.000001'), 'minAmount': this.parseNumber ('10') },
                    'NEAR/USD': { 'amount': this.parseNumber ('0.1'), 'price': this.parseNumber ('0.001'), 'minAmount': this.parseNumber ('0.1') },
                    'PAXG/USD': { 'amount': this.parseNumber ('0.0001'), 'price': this.parseNumber ('0.1'), 'minAmount': this.parseNumber ('0.0001') },
                    'SHIB/USD': { 'amount': this.parseNumber ('100000'), 'price': this.parseNumber ('0.00000001'), 'minAmount': this.parseNumber ('100000') },
                    'SOL/USD': { 'amount': this.parseNumber ('0.01'), 'price': this.parseNumber ('0.0025'), 'minAmount': this.parseNumber ('0.01') },
                    'SUSHI/USD': { 'amount': this.parseNumber ('0.5'), 'price': this.parseNumber ('0.0001'), 'minAmount': this.parseNumber ('0.5') },
                    'USDT/USD': { 'amount': this.parseNumber ('0.01'), 'price': this.parseNumber ('0.0001'), 'minAmount': this.parseNumber ('0.01') },
                    'TRX/USD': { 'amount': this.parseNumber ('1'), 'price': this.parseNumber ('0.0000025'), 'minAmount': this.parseNumber ('1') },
                    'UNI/USD': { 'amount': this.parseNumber ('0.1'), 'price': this.parseNumber ('0.001'), 'minAmount': this.parseNumber ('0.1') },
                    'WBTC/USD': { 'amount': this.parseNumber ('0.0001'), 'price': this.parseNumber ('1'), 'minAmount': this.parseNumber ('0.0001') },
                    'YFI/USD': { 'amount': this.parseNumber ('0.001'), 'price': this.parseNumber ('5'), 'minAmount': this.parseNumber ('0.001') },
                },
            },
            'exceptions': {
                'exact': {
                    'oco orders must be limit orders': InvalidOrder, // {"code":40010001,"message":"oco orders must be limit orders"}
                    'request body format is invalid': InvalidOrder, // {"code":40010000,"message":"request body format is invalid"}
                    'invalid order type for crypto order': InvalidOrder, // {"code":40010001,"message":"invalid order type for crypto order"}
                    'buying power or shares is not sufficient.': InsufficientFunds,
                    'order is not found': OrderNotFound,
                    'failed to cancel order': InvalidOrder,
                    'the order is not cancelable': InvalidOrder,
                    'position is not found': BadRequest,
                    'Failed to liquidate': InvalidOrder,
                    'position does not exist': BadRequest,
                },
                'broad': {
                    'input parameters are not recognized': BadRequest,
                    'invalid query parameters': BadRequest,
                    'unauthorized': PermissionDenied,
                    'too many requests': RateLimitExceeded,
                    'not found': BadSymbol,
                    'request is not authorized': PermissionDenied,
                    'forbidden': PermissionDenied,
                },
            },
        });
    }

    async fetchMarkets (params = {}) {
        /**
         * @method
         * @name alpaca#fetchMarkets
         * @description retrieves data on all markets for alpaca
         * @param {dict} params extra parameters specific to the exchange api endpoint
         * @returns {[dict]} an array of objects representing market data
         */
        const request = {
            'asset_class': 'crypto',
            'tradeable': true,
        };
        const assets = await this.privateGetAssets (this.extend (request, params));
        //
        // {
        //     "id": "904837e3-3b76-47ec-b432-046db621571b",
        //     "class": "us_equity",
        //     "exchange": "NASDAQ",
        //     "symbol": "AAPL",
        //     "status": "active",
        //     "tradable": true,
        //     "marginable": true,
        //     "shortable": true,
        //     "easy_to_borrow": true,
        //     "fractionable": true
        //   }
        //
        const markets = [];
        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            const id = this.safeString (asset, 'symbol');
            const splitIndex = id.length - 3; // all markets settled with USD but the base might have 3/4/5 chars
            const base = id.slice (0, splitIndex).toUpperCase ();
            const quote = id.slice (splitIndex, id.length).toUpperCase ();
            const symbol = base + '/' + quote;
            const baseId = base.toLowerCase ();
            const quoteId = quote.toLowerCase ();
            const precisions = this.safeValue (this.options, 'precision', {});
            const precision = this.safeValue (precisions, symbol, {});
            const amount = this.safeNumber (precision, 'amount');
            const price = this.safeNumber (precision, 'price');
            const minAmount = this.safeNumber (precision, 'minAmount');
            markets.push ({
                'id': id,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'settle': undefined,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': undefined,
                'type': 'spot',
                'spot': true,
                'margin': undefined,
                'swap': false,
                'future': false,
                'option': false,
                'active': undefined,
                'contract': false,
                'linear': undefined,
                'inverse': undefined,
                'contractSize': undefined,
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': amount,
                    'price': price,
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': minAmount,
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'info': asset,
            });
        }
        return markets;
    }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const id = market['id'];
        const request = {
            'symbol': id,
        };
        // specify exchange to avoid bidPrice > askPrice --- interexchange arbitrage opportunities
        // needed to add to pass orderbook test: assert (bids[0][0] <= asks[0][0])
        if (!('exchanges' in params)) {
            params['exchanges'] = this.safeString (this.options, 'defaultExchange');
        }
        const response = await this.cryptoPrivateGetCryptoSymbolXbboLatest (this.extend (request, params));
        //
        // {
        //     "symbol": "BTCUSD",
        //     "xbbo": {
        //     "t": "2021-11-16T22:16:00.468860416Z",
        //     "ax": "FTX",
        //     "ap": 60564,
        //     "as": 0.36,
        //     "bx": "FTX",
        //     "bp": 60555,
        //     "bs": 0.36
        // }
        //
        const ticker = this.safeValue (response, 'xbbo', {});
        return this.parseTicker (ticker, market);
    }

    async fetchTrades (symbol, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name alpaca#fetchTrades
         * @description get the list of most recent trades for a particular symbol
         * @param {str} symbol unified symbol of the market to fetch trades for
         * @param {int|undefined} since timestamp in ms of the earliest trade to fetch
         * @param {int|undefined} limit the maximum amount of trades to fetch
         * @param {dict} params extra parameters specific to the alpaca api endpoint
         * @returns {[dict]} a list of [trade structures]{@link https://docs.ccxt.com/en/latest/manual.html?#public-trades}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const id = market['id'];
        const request = {
            'symbol': id,
        };
        if (since !== undefined) {
            request['start'] = this.iso8601 (since);
        }
        if (limit !== undefined) {
            request['limit'] = parseInt (limit);
        }
        const response = await this.cryptoPrivateGetCryptoSymbolTrades (this.extend (request, params));
        //
        // {
        //     "symbol": "BTCUSD",
        //     "trades": [
        //          {
        //          "t": "2021-11-17T00:18:02.530806Z",
        //          "x": "CBSE",
        //          "p": 60011.36,
        //          "s": 0.00956419,
        //          "tks": "S",
        //          "i": 237168320
        //          },
        // }
        //
        const trades = this.safeValue (response, 'trades', {});
        return this.parseTrades (trades, market, since, limit);
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        /**
         * @method
         * @name blockchaincom#fetchOrderBook
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @param {str} symbol unified symbol of the market to fetch the order book for
         * @param {int|undefined} limit the maximum amount of order book entries to return
         * @param {dict} params extra parameters specific to the blockchaincom api endpoint
         * @returns {dict} A dictionary of [order book structures]{@link https://docs.ccxt.com/en/latest/manual.html#order-book-structure} indexed by market symbols
         */
        return await this.fetchL1OrderBook (symbol, limit, params);
    }

    async fetchL1OrderBook (symbol, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const id = market['id'];
        const request = {
            'symbol': id,
        };
        // specify exchange to avoid bidPrice > askPrice --- interexchange arbitrage opportunities
        // needed to add to pass orderbook test: assert (bids[0][0] <= asks[0][0])
        if (!('exchanges' in params)) {
            params['exchanges'] = this.safeString (this.options, 'defaultExchange');
        }
        const response = await this.cryptoPrivateGetCryptoSymbolXbboLatest (this.extend (request, params));
        //
        //  {
        //      "symbol": "BTCUSD",
        //      "xbbo": {
        //      "t": "2021-11-16T22:16:00.468860416Z",
        //      "ax": "FTX",
        //      "ap": 60564,
        //      "as": 0.36,
        //      "bx": "FTX",
        //      "bp": 60555,
        //      "bs": 0.36
        //  }
        //
        const quote = this.safeValue (response, 'xbbo', {});
        const shallow_bid = [ this.safeNumber (quote, 'bp'), this.safeNumber (quote, 'bs') ];
        const shallow_ask = [ this.safeNumber (quote, 'ap'), this.safeNumber (quote, 'as') ];
        const timestamp = this.milliseconds ();
        const orderbook = {
            'bids': [ shallow_bid ],
            'asks': [ shallow_ask ],
        };
        return this.parseOrderBook (orderbook, symbol, timestamp);
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        /**
         * @method
         * @name alpaca#createOrder
         * @description create a trade order
         * @param {str} symbol unified symbol of the market to create an order in
         * @param {str} type 'market', 'limit' or 'stop_limit'
         * @param {str} side 'buy' or 'sell'
         * @param {float} amount how much of currency you want to trade in units of base currency
         * @param {float} price the price at which the order is to be fullfilled, in units of the quote currency, ignored in market orders
         * @param {dict} params extra parameters specific to the alpaca api endpoint
         * @param {float} params.triggerPrice The price at which a trigger order is triggered at
         * @returns {dict} an [order structure]{@link https://docs.ccxt.com/en/latest/manual.html#order-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const id = market['id'];
        const request = {
            'symbol': id,
            'qty': this.amountToPrecision (symbol, amount),
            'side': side,
            'type': type, // market, limit, stop_limit
        };
        const triggerPrice = this.safeStringN (params, [ 'triggerPrice', 'stop_price' ]);
        if (triggerPrice !== undefined) {
            let newType = undefined;
            if (type.indexOf ('limit') >= 0) {
                newType = 'stop_limit';
            } else {
                throw new NotSupported (this.id + ' createOrder() does not support stop orders for ' + type + ' orders, only stop_limit orders are supported');
            }
            request['stop_price'] = this.priceToPrecision (symbol, triggerPrice);
            request['type'] = newType;
        }
        if (type.indexOf ('limit') >= 0) {
            request['limit_price'] = this.priceToPrecision (symbol, price);
        }
        const defaultTIF = this.safeString (this.options, 'defaultTimeInForce');
        const timeInForce = this.safeString (params, 'timeInForce', defaultTIF);
        request['time_in_force'] = timeInForce;
        params = this.omit (params, [ 'timeInForce', 'triggerPrice' ]);
        const clientOrderIdprefix = this.safeString (this.options, 'clientOrderId');
        const uuid = this.uuid ();
        const parts = uuid.split ('-');
        const random_id = parts.join ('');
        const defaultClientId = this.implodeParams (clientOrderIdprefix, { 'id': random_id });
        const clientOrderId = this.safeString (params, 'clientOrderId', defaultClientId);
        request['client_order_id'] = clientOrderId;
        params = this.omit (params, [ 'clientOrderId' ]);
        const order = await this.privatePostOrders (this.extend (request, params));
        //
        //   {
        //      "id": "61e69015-8549-4bfd-b9c3-01e75843f47d",
        //      "client_order_id": "eb9e2aaa-f71a-4f51-b5b4-52a6c565dad4",
        //      "created_at": "2021-03-16T18:38:01.942282Z",
        //      "updated_at": "2021-03-16T18:38:01.942282Z",
        //      "submitted_at": "2021-03-16T18:38:01.937734Z",
        //      "filled_at": null,
        //      "expired_at": null,
        //      "canceled_at": null,
        //      "failed_at": null,
        //      "replaced_at": null,
        //      "replaced_by": null,
        //      "replaces": null,
        //      "asset_id": "b0b6dd9d-8b9b-48a9-ba46-b9d54906e415",
        //      "symbol": "AAPL",
        //      "asset_class": "us_equity",
        //      "notional": "500",
        //      "qty": null,
        //      "filled_qty": "0",
        //      "filled_avg_price": null,
        //      "order_class": "",
        //      "order_type": "market",
        //      "type": "market",
        //      "side": "buy",
        //      "time_in_force": "day",
        //      "limit_price": null,
        //      "stop_price": null,
        //      "status": "accepted",
        //      "extended_hours": false,
        //      "legs": null,
        //      "trail_percent": null,
        //      "trail_price": null,
        //      "hwm": null
        //   }
        //
        return this.parseOrder (order, market);
    }

    async cancelOrder (id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name alpaca#cancelOrder
         * @description cancels an open order
         * @param {str} id order id
         * @param {str|undefined} symbol unified symbol of the market the order was made in
         * @param {dict} params extra parameters specific to the alpaca api endpoint
         * @returns {dict} An [order structure]{@link https://docs.ccxt.com/en/latest/manual.html#order-structure}
         */
        const request = {
            'order_id': id,
        };
        const response = await this.privateDeleteOrdersOrderId (this.extend (request, params));
        //
        // {
        //     "code": 40410000,
        //     "message": "order is not found."
        // }
        //
        return this.safeValue (response, 'message', {});
    }

    async fetchOrder (id, symbol = undefined, params = {}) {
        /**
         * @method
         * @name alpaca#fetchOrder
         * @description fetches information on an order made by the user
         * @param {str|undefined} symbol unified symbol of the market the order was made in
         * @param {dict} params extra parameters specific to the alpaca api endpoint
         * @returns {dict} An [order structure]{@link https://docs.ccxt.com/en/latest/manual.html#order-structure}
         */
        await this.loadMarkets ();
        const request = {
            'order_id': id,
        };
        const order = await this.privateGetOrdersOrderId (this.extend (request, params));
        const marketId = this.safeString (order, 'symbol');
        const market = this.safeMarket (marketId);
        return this.parseOrder (order, market);
    }

    async fetchOpenOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name alpaca#fetchOpenOrders
         * @description fetch all unfilled currently open orders
         * @param {str|undefined} symbol unified market symbol
         * @param {int|undefined} since the earliest time in ms to fetch open orders for
         * @param {int|undefined} limit the maximum number of  open orders structures to retrieve
         * @param {dict} params extra parameters specific to the alpaca api endpoint
         * @returns {[dict]} a list of [order structures]{@link https://docs.ccxt.com/en/latest/manual.html#order-structure}
         */
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        const orders = await this.privateGetOrders (params);
        return this.parseOrders (orders, market, since, limit);
    }

    parseOrder (order, market = undefined) {
        //
        //    {
        //        "id":"6ecfcc34-4bed-4b53-83ba-c564aa832a81",
        //        "client_order_id":"ccxt_1c6ceab0b5e84727b2f1c0394ba17560",
        //        "created_at":"2022-06-14T13:59:30.224037068Z",
        //        "updated_at":"2022-06-14T13:59:30.224037068Z",
        //        "submitted_at":"2022-06-14T13:59:30.221856828Z",
        //        "filled_at":null,
        //        "expired_at":null,
        //        "canceled_at":null,
        //        "failed_at":null,
        //        "replaced_at":null,
        //        "replaced_by":null,
        //        "replaces":null,
        //        "asset_id":"64bbff51-59d6-4b3c-9351-13ad85e3c752",
        //        "symbol":"BTCUSD",
        //        "asset_class":"crypto",
        //        "notional":null,
        //        "qty":"0.01",
        //        "filled_qty":"0",
        //        "filled_avg_price":null,
        //        "order_class":"",
        //        "order_type":"limit",
        //        "type":"limit",
        //        "side":"buy",
        //        "time_in_force":"day",
        //        "limit_price":"14000",
        //        "stop_price":null,
        //        "status":"accepted",
        //        "extended_hours":false,
        //        "legs":null,
        //        "trail_percent":null,
        //        "trail_price":null,
        //        "hwm":null,
        //        "commission":"0.42",
        //        "source":null
        //    }
        //
        const marketId = this.safeString (order, 'symbol');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        const alpacaStatus = this.safeString (order, 'status');
        const status = this.parseOrderStatus (alpacaStatus);
        const feeValue = this.safeString (order, 'commission');
        let fee = undefined;
        if (feeValue !== undefined) {
            fee = {
                'cost': feeValue,
                'currency': 'USD',
            };
        }
        let orderType = this.safeString (order, 'order_type');
        if (orderType.indexOf ('limit') >= 0) {
            // might be limit or stop-limit
            orderType = 'limit';
        }
        const datetime = this.safeString (order, 'submitted_at');
        const timestamp = this.parse8601 (datetime);
        return this.safeOrder ({
            'id': this.safeString (order, 'id'),
            'clientOrderId': this.safeString (order, 'client_order_id'),
            'timestamp': timestamp,
            'datetime': datetime,
            'lastTradeTimeStamp': undefined,
            'status': status,
            'symbol': symbol,
            'type': orderType,
            'timeInForce': this.safeString (order, 'time_in_force'),
            'postOnly': undefined,
            'side': this.safeString (order, 'side'),
            'price': this.safeNumber (order, 'limit_price'),
            'stopPrice': this.safeNumber (order, 'stop_price'),
            'cost': undefined,
            'average': this.safeNumber (order, 'filled_avg_price'),
            'amount': this.safeNumber (order, 'qty'),
            'filled': this.safeNumber (order, 'filled_qty'),
            'remaining': undefined,
            'trades': undefined,
            'fee': fee,
            'info': order,
        }, market);
    }

    parseOrderStatus (status) {
        const statuses = {
            'accepted': 'open',
            'new': 'open',
            'partially_filled': 'open',
            'activated': 'open',
            'filled': 'closed',
        };
        return this.safeString (statuses, status, status);
    }

    parseTrade (trade, market = undefined) {
        //
        //   {
        //       "t":"2022-06-14T05:00:00.027869Z",
        //       "x":"CBSE",
        //       "p":"21942.15",
        //       "s":"0.0001",
        //       "tks":"S",
        //       "i":"355681339"
        //   }
        //
        let symbol = this.safeString (trade, 'symbol', '');
        if (market !== undefined) {
            symbol = market['symbol'];
        }
        const datetime = this.safeString (trade, 't');
        const timestamp = this.parse8601 (datetime);
        const alpacaSide = this.safeString (trade, 'tks');
        let side = undefined;
        if (alpacaSide === 'B') {
            side = 'buy';
        } else if (alpacaSide === 'S') {
            side = 'sell';
        }
        const priceString = this.safeString (trade, 'p');
        const amountString = this.safeString (trade, 's');
        const price = this.parseNumber (priceString);
        const amount = this.parseNumber (amountString);
        return this.safeTrade ({
            'info': trade,
            'id': this.safeString (trade, 'i'),
            'timestamp': timestamp,
            'datetime': datetime,
            'symbol': symbol,
            'order': undefined,
            'type': undefined,
            'side': side,
            'takerOrMaker': 'taker',
            'price': price,
            'amount': amount,
            'cost': undefined,
            'fee': undefined,
        }, market);
    }

    parseTicker (ticker, market = undefined) {
        //
        //   {
        //       "t":"2022-06-14T13:05:22.642Z",
        //       "ax":"CBSE",
        //       "ap":"22163.42",
        //       "as":"0.10021214",
        //       "bx":"CBSE",
        //       "bp":"22160.03",
        //       "bs":"0.03923939"
        //   }
        //
        const symbol = market['symbol'];
        const datetime = this.safeString (ticker, 't');
        const timestamp = this.parse8601 (datetime);
        return this.safeTicker ({
            'symbol': symbol,
            'info': ticker,
            'timestamp': timestamp,
            'datetime': datetime,
            'high': undefined,
            'low': undefined,
            'bid': this.safeNumber (ticker, 'bp'),
            'bidVolume': this.safeNumber (ticker, 'bs'),
            'ask': this.safeNumber (ticker, 'ap'),
            'askVolume': this.safeNumber (ticker, 'as'),
            'vwap': undefined,
            'open': undefined,
            'close': undefined,
            'last': undefined,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': undefined,
            'quoteVolume': undefined,
        }, market);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const versions = this.safeValue (this.options, 'versions');
        const version = this.safeString (versions, api);
        let endpoint = '/' + this.implodeParams (path, params);
        let url = this.implodeParams (this.urls['api'][api], { 'version': version });
        url = this.implodeHostname (url);
        headers = (headers !== undefined) ? headers : {};
        if ((api === 'private') || (api === 'crypto')) {
            headers['APCA-API-KEY-ID'] = this.apiKey;
            headers['APCA-API-SECRET-KEY'] = this.secret;
        }
        const query = this.omit (params, this.extractParams (path));
        if (Object.keys (query).length) {
            if ((method === 'GET') || (method === 'DELETE')) {
                endpoint += '?' + this.urlencode (query);
            } else {
                body = this.json (query);
                headers['Content-Type'] = 'application/json';
            }
        }
        url = url + endpoint;
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return; // default error handler
        }
        // {
        //     "code": 40110000,
        //     "message": "request is not authorized"
        // }
        const message = this.safeValue (response, 'message', undefined);
        if (message !== undefined) {
            const feedback = this.id + ' ' + body;
            this.throwExactlyMatchedException (this.exceptions['exact'], message, feedback);
            this.throwBroadlyMatchedException (this.exceptions['broad'], message, feedback);
            throw new ExchangeError (feedback);
        }
    }
};
